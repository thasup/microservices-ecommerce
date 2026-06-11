# Aurapan on AWS — Terraform

Minimum-sustained-cost AWS deployment: one ARM EC2 instance running
single-node [k3s](https://k3s.io), with ingress-nginx bound directly to
ports 80/443 (no load balancer) and cert-manager for free Let's Encrypt TLS.

```
Internet ──> Elastic IP ──> EC2 t4g.small (Ubuntu 24.04 arm64)
                              └─ k3s (traefik disabled)
                                  ├─ ingress-nginx (hostNetwork DaemonSet, 80/443)
                                  ├─ cert-manager (Let's Encrypt HTTP-01)
                                  ├─ client, user, product, order, payment, expiration
                                  ├─ NATS Streaming + Redis (always in-cluster)
                                  └─ MongoDB ×4 (in-cluster by default, or Atlas M0)
```

## Monthly cost

| Item | Cost (us-east-1, on-demand) |
| --- | --- |
| EC2 `t4g.small` (2 vCPU, 2 GiB, ARM) | ~$12.26 |
| EBS 20 GB gp3 root volume | ~$1.60 |
| Elastic IP (attached to a running instance) | $0.00 |
| Data transfer out (low-traffic shop) | ~$1.00 |
| Route 53 hosted zone (optional — any DNS provider works) | $0.50 |
| MongoDB Atlas M0 (optional) | $0.00 |
| **Total** | **≈ $15/mo** (vs ~$30/mo on DigitalOcean) |

Cheaper still: `instance_type = "t4g.micro"` (~$6.13/mo) handles light traffic
if you move MongoDB to Atlas (`use_in_cluster_databases = false`). A 1-year
no-upfront EC2 Instance Savings Plan cuts the instance price ~30% further.

Deliberately avoided: EKS control plane ($73/mo), NAT gateway (~$32/mo + data),
ALB/NLB (~$16/mo), and paid container registries (images live on Docker Hub).

## Prerequisites

- Terraform >= 1.5, AWS CLI with credentials configured
- An AWS account with a **default VPC** (every account has one unless deleted)
- A domain you control (any registrar)
- [Session Manager plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
  for the AWS CLI (for shell access — no SSH keys are used)
- Docker images published to Docker Hub (`thasup/*` by default — CI does this
  on push to `main`, or run `./setup.sh` once). ARM instances need arm64 or
  multi-arch images.

## Deploy

```sh
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # edit: domain, acme_email, secrets
terraform init
terraform plan
terraform apply
```

Then:

1. Point your domain's **A record** at the `public_ip` output.
2. Wait ~5 minutes for the first boot to finish. Watch it with:
   ```sh
   aws ssm start-session --target <instance_id> --region <region>
   sudo tail -f /var/log/user-data.log
   ```
3. Browse `https://<domain>` — cert-manager issues the TLS certificate
   automatically once DNS resolves (use the `letsencrypt-staging` issuer in
   `infra/k8s-aws/ingress-srv.yaml` first if you are testing repeatedly).
4. Seed data: see [scripts/README.md](../../scripts/README.md) (run the seed
   script on the node via SSM, or port-forward through an SSM tunnel).

## Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `aws_region` | `us-east-1` | Deployment region |
| `project_name` | `aurapan` | Resource name prefix |
| `instance_type` | `t4g.small` | EC2 size; AMI arch follows the family (t4g→arm64) |
| `root_volume_size_gb` | `20` | gp3 root volume |
| `admin_cidr` | `""` (closed) | Optionally open 22/6443 to your IP |
| `domain` | — (required) | Public hostname, used for ingress + TLS |
| `acme_email` | — (required) | Let's Encrypt registration email |
| `git_repo` / `git_ref` | this repo / `main` | Source of the k8s manifests |
| `docker_registry` | `thasup` | Docker Hub namespace for service images |
| `use_in_cluster_databases` | `true` | Deploy `infra/k8s-local-db` MongoDBs |
| `jwt_key` | — (required, sensitive) | JWT signing key |
| `mongo_uri_user/product/order/payment` | `""` → in-cluster | External (Atlas) URIs |
| `stripe_key` | — (required, sensitive) | Stripe secret key |
| `paypal_client_id` | — (required, sensitive) | PayPal client ID |
| `stripe_publishable_key`, `paypal_public_client_id`, `ga_id` | `""` | Optional storefront keys |

## Databases: in-cluster vs Atlas

- **In-cluster (default, $0 extra)** — the four MongoDB deployments from
  `infra/k8s-local-db` run on the node with 1 Gi PersistentVolumeClaims
  (k3s `local-path` storage on the EBS volume). Data survives pod restarts,
  but durability is tied to that single node/volume — fine for a demo or
  portfolio deployment.
- **MongoDB Atlas M0 (recommended for production, also $0)** — managed, with
  backups and replica sets. Create a free M0 cluster, allow the elastic IP in
  Atlas network access, set the four `mongo_uri_*` variables and
  `use_in_cluster_databases = false`.

Redis (the expiration service's Bull queue) always runs in-cluster; it holds
only ephemeral timer state.

## Operations

```sh
terraform output                       # IP, URL, SSM command
aws ssm start-session --target <id>    # shell on the node (no SSH)
# on the node:
sudo kubectl get pods -A               # kubeconfig at /etc/rancher/k3s/k3s.yaml
sudo kubectl rollout restart deployment user-depl   # pull a freshly pushed image
sudo bash /var/lib/cloud/instance/user-data.txt     # re-run the bootstrap (idempotent)
```

## Teardown

```sh
terraform destroy
```

Everything (instance, EIP, security group, IAM role) is removed; with
in-cluster databases the data goes with it. Atlas data is unaffected.
