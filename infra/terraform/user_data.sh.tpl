#!/usr/bin/env bash
# Bootstrap a single-node k3s cluster running the Aurapan microservices shop.
# Rendered by Terraform (templatefile): dollar-brace placeholders are filled
# in by Terraform; "$$" sequences are escapes that render as a literal "$".
# The script is re-runnable: every step either no-ops or converges when
# executed again (e.g. via SSM after changing variables).
set -uo pipefail

# Log everything to /var/log/user-data.log (and the console).
exec > >(tee -a /var/log/user-data.log) 2>&1
echo "=== aurapan bootstrap started: $(date -Is) ==="

export DEBIAN_FRONTEND=noninteractive

# ---------------------------------------------------------------------------
# 1. Base packages (git for cloning, gettext-base for envsubst)
# ---------------------------------------------------------------------------
apt-get update -y
apt-get install -y git curl gettext-base

# ---------------------------------------------------------------------------
# 2. k3s — lightweight single-binary Kubernetes.
#    Traefik is disabled because we run ingress-nginx (the manifests and the
#    client's API_URL expect the ingress-nginx service name).
# ---------------------------------------------------------------------------
if ! command -v k3s >/dev/null 2>&1; then
  curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik" sh -
fi

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

echo "Waiting for the k3s node to become Ready..."
until kubectl wait --for=condition=Ready node --all --timeout=10s >/dev/null 2>&1; do
  sleep 5
done

# ---------------------------------------------------------------------------
# 3. ingress-nginx + cert-manager via the k3s built-in Helm controller.
#
#    ingress-nginx runs as a hostNetwork DaemonSet: on a single node this is
#    the simplest reliable way to serve ports 80/443 — the controller binds
#    them directly on the host, so no cloud LoadBalancer (~$16/mo) and no
#    NodePort remapping is needed. The ClusterIP service is kept because the
#    Next.js client uses http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
#    for server-side API calls.
# ---------------------------------------------------------------------------
mkdir -p /var/lib/rancher/k3s/server/manifests

cat > /var/lib/rancher/k3s/server/manifests/ingress-nginx.yaml <<'EOF'
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: ingress-nginx
  namespace: kube-system
spec:
  repo: https://kubernetes.github.io/ingress-nginx
  chart: ingress-nginx
  version: 4.11.3
  targetNamespace: ingress-nginx
  createNamespace: true
  valuesContent: |-
    controller:
      kind: DaemonSet
      hostNetwork: true
      dnsPolicy: ClusterFirstWithHostNet
      service:
        type: ClusterIP
      ingressClassResource:
        default: true
EOF

cat > /var/lib/rancher/k3s/server/manifests/cert-manager.yaml <<'EOF'
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: cert-manager
  namespace: kube-system
spec:
  repo: https://charts.jetstack.io
  chart: cert-manager
  version: v1.16.2
  targetNamespace: cert-manager
  createNamespace: true
  valuesContent: |-
    crds:
      enabled: true
EOF

# ---------------------------------------------------------------------------
# 4. Application secrets (names/keys must match infra/k8s/*-depl.yaml).
#    `create --dry-run | apply` keeps this idempotent.
# ---------------------------------------------------------------------------
kubectl create secret generic jwt-secret \
  --from-literal=JWT_KEY='${jwt_key}' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic mongo-secret \
  --from-literal=MONGO_URI_USER='${mongo_uri_user}' \
  --from-literal=MONGO_URI_PRODUCT='${mongo_uri_product}' \
  --from-literal=MONGO_URI_ORDER='${mongo_uri_order}' \
  --from-literal=MONGO_URI_PAYMENT='${mongo_uri_payment}' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_KEY='${stripe_key}' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic paypal-secret \
  --from-literal=PAYPAL_CLIENT_ID='${paypal_client_id}' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic client-secret \
  --from-literal=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='${stripe_publishable_key}' \
  --from-literal=NEXT_PUBLIC_PAYPAL_CLIENT_ID='${paypal_public_client_id}' \
  --from-literal=NEXT_PUBLIC_GA_ID='${ga_id}' \
  --dry-run=client -o yaml | kubectl apply -f -

# ---------------------------------------------------------------------------
# 5. Fetch the manifests and deploy the application.
#    Images come from Docker Hub (pushed by GitHub Actions CI) — the
#    manifests reference thasup/<service>; rewrite if a different registry
#    namespace was configured.
# ---------------------------------------------------------------------------
REPO_DIR=/opt/aurapan
rm -rf "$REPO_DIR"
git clone --depth 1 --branch '${git_ref}' '${git_repo}' "$REPO_DIR"
cd "$REPO_DIR"

if [ '${docker_registry}' != 'thasup' ]; then
  sed -i 's|image: thasup/|image: ${docker_registry}/|' infra/k8s/*.yaml
fi

kubectl apply -f infra/k8s
%{ if use_in_cluster_databases ~}
kubectl apply -f infra/k8s-local-db
%{ else ~}
echo "use_in_cluster_databases=false: skipping infra/k8s-local-db (external MongoDB URIs provided)."
%{ endif ~}

# ---------------------------------------------------------------------------
# 6. Ingress + TLS. Wait for the cert-manager webhook before applying the
#    ClusterIssuers, then envsubst the DOMAIN/ACME_EMAIL placeholders.
# ---------------------------------------------------------------------------
export DOMAIN='${domain}'
export ACME_EMAIL='${acme_email}'

echo "Waiting for cert-manager webhook..."
until kubectl -n cert-manager rollout status deployment/cert-manager-webhook --timeout=15s >/dev/null 2>&1; do
  sleep 5
done

RENDER_DIR=$(mktemp -d)
envsubst '$${ACME_EMAIL}' < infra/k8s-aws/issuers.yaml > "$RENDER_DIR/issuers.yaml"
envsubst '$${DOMAIN}'     < infra/k8s-aws/ingress-srv.yaml > "$RENDER_DIR/ingress-srv.yaml"
kubectl apply -f "$RENDER_DIR/issuers.yaml"

echo "Waiting for the ingress-nginx admission webhook..."
until kubectl -n ingress-nginx rollout status daemonset/ingress-nginx-controller --timeout=15s >/dev/null 2>&1; do
  sleep 5
done
# Retry: the admission webhook can lag a few seconds behind the rollout.
until kubectl apply -f "$RENDER_DIR/ingress-srv.yaml"; do
  sleep 5
done
rm -rf "$RENDER_DIR"

echo "=== aurapan bootstrap finished: $(date -Is) ==="
echo "Point the A record of $DOMAIN at this instance's elastic IP."
echo "TLS will be issued automatically by cert-manager once DNS resolves."
