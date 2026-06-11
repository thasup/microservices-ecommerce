# Deployment guide

Two supported targets:

- **Local development** — Docker Desktop's built-in Kubernetes + Skaffold (hot reload)
- **Production** — AWS, single-node k3s on EC2 provisioned by Terraform (~$15/month)

---

## 1. Local development (Docker Desktop)

### Prerequisites

- [Docker Desktop](https://www.docker.com/) with Kubernetes enabled (Settings → Kubernetes → Enable)
- [Node.js 22+](https://nodejs.org/)
- [Skaffold](https://skaffold.dev/docs/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

### Steps

1. **Select the context**

   ```sh
   kubectl config use-context docker-desktop
   ```

2. **Install ingress-nginx**

   ```sh
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.3/deploy/static/provider/cloud/deploy.yaml
   kubectl -n ingress-nginx wait --for=condition=Available deployment/ingress-nginx-controller --timeout=180s
   ```

3. **Add the hosts entry** (`/etc/hosts` on Mac/Linux, `C:\Windows\System32\drivers\etc\hosts` on Windows, edit as administrator):

   ```
   127.0.0.1 aurapan.local
   ```

4. **Create secrets** (in-cluster MongoDB URIs for local dev; Stripe/PayPal test credentials):

   ```sh
   kubectl create secret generic mongo-secret \
     --from-literal=MONGO_URI_USER="mongodb://user-mongo-srv:27017/users-db" \
     --from-literal=MONGO_URI_PRODUCT="mongodb://product-mongo-srv:27017/products-db" \
     --from-literal=MONGO_URI_ORDER="mongodb://order-mongo-srv:27017/orders-db" \
     --from-literal=MONGO_URI_PAYMENT="mongodb://payment-mongo-srv:27017/payments-db"

   kubectl create secret generic jwt-secret \
     --from-literal=JWT_KEY="$(openssl rand -hex 32)"

   kubectl create secret generic stripe-secret \
     --from-literal=STRIPE_KEY="sk_test_..."

   kubectl create secret generic paypal-secret \
     --from-literal=PAYPAL_CLIENT_ID="..."

   # optional — storefront public keys (falls back to built-in test keys)
   kubectl create secret generic client-secret \
     --from-literal=NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
     --from-literal=NEXT_PUBLIC_PAYPAL_CLIENT_ID="..." \
     --from-literal=NEXT_PUBLIC_GA_ID=""
   ```

5. **Run**

   ```sh
   skaffold dev
   ```

   First build takes a few minutes; afterwards source changes hot-sync into the
   running pods. Browse **http://aurapan.local**.

6. **Seed sample data** — see [`scripts/README.md`](../scripts/README.md):

   ```sh
   # terminal 1
   kubectl port-forward svc/user-mongo-srv 27018:27017
   # terminal 2
   cd scripts && npm install && npm run seed
   ```

   Seeded accounts: `admin@aurapan.com` (admin), `emma@example.com`,
   `sofia@example.com` — password `password123`.

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| `404` from nginx on every path | Ingress not ready yet, or hosts entry missing |
| Pods `CrashLoopBackOff` on start | Check `kubectl logs` — usually a missing secret |
| Stripe payment fails | `STRIPE_KEY` secret must be a *secret* key (`sk_test_`), the client key a *publishable* one |
| Port 80 already in use | Stop other local web servers, or change the ingress-nginx service mapping |

---

## 2. Production on AWS (Terraform)

Provisions: 1× EC2 (default `t4g.small`, ARM) running single-node k3s,
Elastic IP, security group (80/443 only), IAM role for SSM Session Manager,
ingress-nginx (hostNetwork), cert-manager with Let's Encrypt, all app
manifests and secrets. **No EKS, NAT gateway or load balancer fees.**
Cost breakdown: [`infra/terraform/README.md`](../infra/terraform/README.md).

### Prerequisites

- [Terraform >= 1.5](https://developer.hashicorp.com/terraform/install)
- AWS account + credentials configured (`aws configure`)
- A domain you control
- Docker Hub images published (push to `main` triggers the `deploy-*` workflows,
  or run `docker buildx build --platform linux/amd64,linux/arm64` manually per service)

### Steps

1. **Configure**

   ```sh
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   # edit: domain, acme_email, jwt_key, stripe_key, paypal_client_id,
   #       (optionally) MongoDB Atlas URIs, instance_type, aws_region
   ```

   For durable data, create a free [MongoDB Atlas M0](https://www.mongodb.com/pricing)
   cluster and set the four `mongo_uri_*` variables + `use_in_cluster_databases = false`.
   Leaving the defaults runs MongoDB in-cluster on the node's EBS volume at $0 extra.

2. **Apply**

   ```sh
   terraform init
   terraform apply
   ```

3. **Point DNS** — create an A record for your domain → the `public_ip` output.
   cert-manager issues the TLS certificate automatically once DNS resolves
   (typically 2–10 minutes).

4. **Watch the bootstrap** (optional):

   ```sh
   aws ssm start-session --target $(terraform output -raw instance_id)
   sudo tail -f /var/log/user-data.log
   ```

5. **Seed** — from your machine, against the public URL:

   ```sh
   # terminal 1: tunnel to the in-cluster user DB through SSM
   aws ssm start-session --target <instance-id> \
     --document-name AWS-StartPortForwardingSession \
     --parameters '{"portNumber":["30017"],"localPortNumber":["27018"]}'
   # (expose user-mongo-srv as NodePort 30017 first, or run the seed ON the node via SSM)

   # terminal 2
   API_URL=https://yourdomain.com cd scripts && npm run seed
   ```

   Simplest alternative: open an SSM shell on the node, clone the repo there and run
   `API_URL=https://yourdomain.com MONGO_URI_USER=mongodb://<user-mongo-cluster-ip>:27017/users-db npm run seed`.

6. **Wire up CI rollouts** (optional) — add repository **variables**
   `AWS_REGION` and `AURAPAN_INSTANCE_ID` (from `terraform output`) and
   **secrets** `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (an IAM user
   allowed `ssm:SendCommand` on the instance). Every push to `main` then
   builds, pushes and restarts the affected service automatically.

### Updating

- **App code**: push to `main` → CI builds the multi-arch image → SSM rollout restarts the deployment.
- **Manifests**: changes under `infra/k8s*` on `main` trigger `deploy-manifests` (same SSM mechanism).
- **Infrastructure**: edit tfvars / *.tf, `terraform apply`.

### Teardown

```sh
terraform destroy
```

The Elastic IP, instance, EBS volume and IAM role are removed. (In-cluster
data is destroyed with the volume — export anything you need first.)
