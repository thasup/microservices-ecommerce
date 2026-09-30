# Seed script

Populates a running Aurapan deployment with an admin user, two demo customers
and ten realistic women's-clothing products.

Products are created **through the product API** (not by direct DB insert),
because the order and payment services keep their own replicated copies of
product data that are synchronized via NATS events — only API-created products
propagate correctly. The single direct DB write the script performs is flipping
`isAdmin: true` on the admin user, which the public signup API (rightly) does
not allow.

## Usage (local Docker Desktop cluster)

```sh
# terminal 1 — expose the user DB for the one-time admin promotion
kubectl port-forward svc/user-mongo-srv 27018:27017

# terminal 2
cd scripts
npm install
npm run seed
```

Requires Node.js 22+. The script is idempotent — users (matched by email) and
products (matched by title) that already exist are skipped, so re-running is
safe.

## What it does

1. Waits for `GET /api/products` to respond (API + ingress up).
2. Signs up `admin@aurapan.com`, `emma@example.com`, `sofia@example.com`
   (password: `SEED_ADMIN_PASSWORD`, default `password123`).
3. Sets `isAdmin: true` for `admin@aurapan.com` directly in the user MongoDB.
4. Signs in as the admin and captures the session cookie.
5. Creates 10 products (categories `Top`, `Bottom`, `Dress`, `Coat`, `Set`)
   via `POST /api/products` so NATS `product:created` events reach the
   order/payment services.
6. Verifies all products appear in `GET /api/products`.

## Configuration

| Env var | Default | Meaning |
| --- | --- | --- |
| `API_URL` | `http://aurapan.local` | Base URL of the deployment |
| `HOST_HEADER` | _(unset)_ | Optional `Host` header, for when `API_URL` is an IP |
| `MONGO_URI_USER` | `mongodb://localhost:27018/users-db` | User-service MongoDB (matches the port-forward above) |
| `SEED_ADMIN_PASSWORD` | `password123` | Password for every seeded account |

## Seeding the AWS deployment

Easiest: run the script **on the k3s node** so the in-cluster DNS names work
directly:

```sh
aws ssm start-session --target <instance_id>
sudo -i
# Node 22 via nvm (one-time)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
. ~/.nvm/nvm.sh && nvm install 22
cd /opt/aurapan/scripts && npm install
API_URL=https://<your-domain> \
MONGO_URI_USER=mongodb://$(sudo kubectl get svc user-mongo-srv -o jsonpath='{.spec.clusterIP}'):27017/users-db \
SEED_ADMIN_PASSWORD='<strong-password>' \
npm run seed
```

With MongoDB Atlas (`use_in_cluster_databases = false`) you can instead run
the script from your laptop: `API_URL=https://<your-domain>
MONGO_URI_USER='mongodb+srv://...users-db' npm run seed`.

**Always set a strong `SEED_ADMIN_PASSWORD` on a public deployment.**

## Note on product images

The seeded products use Cloudinary-style image paths
(`v1700000000/aurapan/products/<slug>-1.jpg`) in the format the storefront's
image loader expects. They are placeholders — upload matching assets to your
Cloudinary account, or edit each product's images in the admin dashboard.
