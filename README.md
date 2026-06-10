<!-- Add banner here -->

![Project Preview](docs/aurapan-shop-banner-1.jpg)

# Aurapan

Aurapan is a women's clothing e-commerce website built on a fully operational **microservices architecture**: a **Next.js 15 (App Router)** storefront and five independent **TypeScript / Express** services (user, product, order, payment, expiration) that communicate over **NATS Streaming** events and store data in separate **MongoDB** databases. It runs locally on **Docker Desktop Kubernetes** and deploys to **AWS** with a single **Terraform** apply on a low-cost single-node **k3s** cluster (~$15/month).

# Table of contents

- [Aurapan](#aurapan)
- [Table of contents](#table-of-contents)
- [Architecture](#architecture)
- [Features](#features)
- [Quick start (local, Docker Desktop)](#quick-start-local-docker-desktop)
- [Seeding sample data](#seeding-sample-data)
- [Deploying to AWS with Terraform](#deploying-to-aws-with-terraform)
- [Kubernetes secrets](#kubernetes-secrets)
- [Usage](#usage)
- [Technology](#technology)
- [Documentation](#documentation)
- [Disclaimer](#disclaimer)

# Architecture

| Component | Stack | Responsibility |
| --- | --- | --- |
| `client` | Next.js 15, React 19, App Router | Storefront, checkout, admin dashboard |
| `user` | Express, Mongoose, JWT | Auth (cookie session), profiles, admin user management |
| `product` | Express, Mongoose | Catalog, reviews, bestsellers |
| `order` | Express, Mongoose | Orders, cart expiration tracking |
| `payment` | Express, Mongoose, Stripe | Stripe/PayPal payment capture |
| `expiration` | Bull + Redis | Order expiration timers |
| `nats` | NATS Streaming | Event bus between services |

Each service owns its own MongoDB database; cross-service data (e.g. product info inside the order service) is replicated through NATS events with optimistic concurrency control.

# Features

- A fully operational microservices website with user, product, order, payment, and expiration services completely separated.
- User authentication with scrypt-hashed passwords, JWT and secure cookies.
- A customer account dashboard to update profile information and see all orders.
- An admin management dashboard to add, edit, and delete products, users, and orders.
- Detailed product pages with color/size options and a Swiper image gallery.
- A full-featured shopping cart with add, edit, and remove items.
- A complete checkout flow: sign in, shipping address, payment method, payment.
- Both **Stripe** (Payment Element–style card form) and **PayPal** payments.
- Product reviews and ratings with instant recalculation.
- Coupon promotions, breadcrumbs, responsive navbar.
- Optimistic concurrency control with Mongoose to keep event flow consistent.
- HTTPS via cert-manager + Let's Encrypt on AWS.

# Quick start (local, Docker Desktop)

1. Install [Node.js 22+](https://nodejs.org/en/), [Docker Desktop](https://www.docker.com/) (enable Kubernetes in preferences), [Skaffold](https://skaffold.dev/), and [kubectl](https://kubernetes.io/docs/tasks/tools/).

2. Use the Docker Desktop Kubernetes context:

```sh
kubectl config use-context docker-desktop
```

3. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start):

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.3/deploy/static/provider/cloud/deploy.yaml
```

4. Add the local host entry (Mac/Linux: `/etc/hosts`, Windows: `C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1 aurapan.local
```

5. Create the [Kubernetes secrets](#kubernetes-secrets).

6. Start everything (builds all images and deploys all manifests, with hot-reload file sync):

```sh
skaffold dev
```

7. Browse http://aurapan.local — then [seed sample data](#seeding-sample-data).

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full walkthrough and troubleshooting.

# Seeding sample data

The seed script creates an admin (`admin@aurapan.com`), demo customers, and ~10 realistic products **through the real APIs**, so product data propagates to the order/payment services via NATS events exactly like production traffic.

```sh
# in one terminal: expose the user database for the one-time admin promotion
kubectl port-forward svc/user-mongo-srv 27018:27017

# in another terminal
cd scripts && npm install && npm run seed
```

Configuration via env vars: `API_URL` (default `http://aurapan.local`), `MONGO_URI_USER` (default `mongodb://localhost:27018/users-db`), `SEED_ADMIN_PASSWORD` (default `password123`). See [scripts/README.md](scripts/README.md).

# Deploying to AWS with Terraform

The Terraform stack in [`infra/terraform`](infra/terraform) provisions the cheapest reliable setup for a sustained deployment — about **$15/month** (vs ~$30 on DigitalOcean):

- 1× EC2 `t4g.small` (ARM) running single-node **k3s** — ~$12.3/mo
- 20 GB gp3 EBS — ~$1.6/mo
- Elastic IP (free while attached), no NAT gateway, no EKS control-plane fee
- ingress-nginx + cert-manager (Let's Encrypt TLS) installed automatically
- Access via AWS SSM Session Manager (no SSH port open)
- MongoDB Atlas M0 (free tier) recommended for durable data, or in-cluster MongoDB at zero cost

```sh
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # fill in domain, email, secrets
terraform init
terraform apply
```

Then point your domain's A record at the output Elastic IP and wait for the cluster to bootstrap (~5 minutes). Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), cost details: [infra/terraform/README.md](infra/terraform/README.md).

# Kubernetes secrets

```sh
kubectl create secret generic mongo-secret \
  --from-literal=MONGO_URI_PRODUCT="mongodb://product-mongo-srv:27017/products-db" \
  --from-literal=MONGO_URI_USER="mongodb://user-mongo-srv:27017/users-db" \
  --from-literal=MONGO_URI_ORDER="mongodb://order-mongo-srv:27017/orders-db" \
  --from-literal=MONGO_URI_PAYMENT="mongodb://payment-mongo-srv:27017/payments-db"

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<ANY_RANDOM_STRING>

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<YOUR_STRIPE_SECRET_KEY>

kubectl create secret generic paypal-secret --from-literal=PAYPAL_CLIENT_ID=<YOUR_PAYPAL_CLIENT_ID>
```

The mongo URIs above use the in-cluster databases (local dev default). For AWS with MongoDB Atlas, use your `mongodb+srv://...` connection strings instead — on AWS these secrets are created automatically by Terraform from your `terraform.tfvars`.

# Usage

## Sign up for an account

1. Visit `/signup` and enter an email, password, name, gender, and age (fictional is fine).
2. Or sign in with the seeded admin: `admin@aurapan.com` / `password123` (change via `SEED_ADMIN_PASSWORD`).

## Purchase products

### Pay with Stripe (recommended)

1. Card number: `4242 4242 4242 4242`
2. Any future date for `MM/YY`, any `CVC`.

### Pay with PayPal

1. Create a sandbox account at [developer.paypal.com](https://developer.paypal.com/tools/sandbox/accounts/).
2. Choose PayPal at checkout and sign in with the sandbox account.

## Admin dashboard

Sign in with an admin account and open the management menu in the profile dropdown to manage products, users, and orders (CRUD + mark orders as delivered).

# Technology

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) + [Express](https://expressjs.com/)
- [React-Bootstrap](https://react-bootstrap.github.io/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [NATS Streaming Server](https://docs.nats.io/legacy/stan)
- [Docker](https://www.docker.com/) + [Kubernetes](https://kubernetes.io/) + [Skaffold](https://skaffold.dev/)
- [Terraform](https://www.terraform.io/) + [AWS](https://aws.amazon.com/) (EC2 + k3s)
- [Stripe](https://stripe.com/) + [PayPal](https://developer.paypal.com/)
- [GitHub Actions](https://github.com/features/actions)

# Documentation

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — local + AWS deployment, end to end
- [docs/SECURITY-AUDIT.md](docs/SECURITY-AUDIT.md) — security audit, dependency patches, remaining risks
- [infra/terraform/README.md](infra/terraform/README.md) — infrastructure details and monthly cost breakdown
- [scripts/README.md](scripts/README.md) — seed script usage

# Disclaimer

All images used in this project are for educational purposes only. 😘
