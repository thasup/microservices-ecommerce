# Security audit — June 2026 revamp

Scope: all five backend services (`user`, `product`, `order`, `payment`,
`expiration`), the Next.js storefront (`client`), Kubernetes manifests, CI
workflows and the new AWS infrastructure. Verified with `npm audit`,
dependency review and manual inspection.

## Result summary

| Area | Before | After |
| --- | --- | --- |
| `npm audit` (each backend service) | dozens of findings incl. **high** (jsonwebtoken, old express/qs chain, mongoose 6) | **0 vulnerabilities** |
| Runtime | Node 16 (EOL Sep 2023) images, `ts-node`/`nodemon` in production, root user | Node 22 LTS, compiled TS, non-root `USER node` |
| Client | Next.js 12 / React 17 (EOL line), abandoned payment libs | Next.js 15 / React 19, maintained official SDKs |
| Transport | HTTP-only local setup; DO config drifted | TLS via cert-manager + Let's Encrypt on AWS |

## Dependency vulnerabilities fixed

### Backend services (user, product, order, payment, expiration)

| Package | Before | After | Notes |
| --- | --- | --- | --- |
| jsonwebtoken | ^8.5.1 | **^9.0.2** | CVE-2022-23529, CVE-2022-23539, CVE-2022-23540, CVE-2022-23541 (signature-bypass / arbitrary-key issues). An **npm override** also forces v9 inside `@thasup-dev/common`, which still pins v8. |
| express | ^4.17.2 | ^4.21.2 | pulls patched `qs`, `body-parser`, `path-to-regexp`, `cookie`, `send` (multiple CVEs in the 4.17 chain) |
| mongoose | ^6.2.1 | ^8.16 | fixes search-injection advisories in <6.13/<7.8 lines (GHSA-m7xq, GHSA-vg7j) and brings the supported driver |
| express-validator | ^6.14 | ^7.2 | maintained line |
| cookie-session | ^2.0.0 | ^2.1.1 | patched `cookie` dependency |
| stripe | ^8.205 | ^18.x | 8.x is long unsupported |
| bull | ^4.6 | ^4.16 + `uuid` override ^11.1.1 | uuid buffer bounds-check advisory |
| jest / ts-jest / supertest / mongodb-memory-server | 27 / 27 / 6 / 8 | 29 / 29 / 7 / 10 | dev-only, removes vulnerable transitive trees |
| typescript | 4.9 | 5.8 | — |

`npm audit` after the upgrade: **0 vulnerabilities in every service**.

### Client

- Next.js 12.0.10 → **15.x** (the 12 line has numerous patched advisories,
  including SSRF/cache-poisoning fixes in later majors; 12 is unsupported).
- React 17 → 19, axios 0.26 → 1.x (CVE-2023-45857 SSRF/credential-leak fixed
  in 1.x line), swiper 8 → 11.
- Removed abandoned packages that no longer receive security fixes and pulled
  legacy React internals: `react-stripe-checkout` (replaced by
  `@stripe/react-stripe-js`), `react-paypal-button-v2` (replaced by
  `@paypal/react-paypal-js`), `react-rating-stars-component` (replaced by a
  small local component).
- Fixed `baseUrl` typo in the browser API client (requests silently fell back
  to page-relative URLs).

## Platform and container hardening

- **Images**: `node:16-alpine` / `node:lts-alpine` (floating) → pinned
  `node:22-alpine`; multi-stage builds; production images contain compiled JS
  only — no TypeScript toolchain, no dev dependencies, no file watchers.
- **Non-root**: every app container runs as `USER node`;
  `runAsNonRoot: true`, `allowPrivilegeEscalation: false`,
  `capabilities: drop: [ALL]` in every deployment.
- **Probes**: liveness + readiness on `/healthz` (services) and
  `/api/healthz` (client) — crashed/hung pods are restarted and removed from
  service endpoints automatically.
- **Resource limits** on every container — a misbehaving pod can no longer
  starve the node.
- **Pinned infra images**: `mongo` (floating latest) → `mongo:7`,
  `nats-streaming:0.17.0` (2020) → `0.25.6` (final release),
  `redis:7-alpine`. MongoDB data moved to PersistentVolumeClaims.

## AWS infrastructure security (new)

- **No SSH**: port 22 closed by default; shell access via AWS SSM Session
  Manager (IAM-authenticated, audited). Optional `admin_cidr` variable opens
  22/6443 to one CIDR only.
- **IMDSv2 required** on the EC2 instance — blocks SSRF-style credential
  theft from workloads.
- Inbound security group: 80/443 only. IAM role: `AmazonSSMManagedInstanceCore`
  only.
- **TLS**: cert-manager + Let's Encrypt; certificates renew automatically.
- **Secrets**: never in manifests or images — created as Kubernetes Secrets
  from Terraform variables (all marked `sensitive`); `terraform.tfvars` is
  gitignored. EBS volume encrypted.
- CI deploy workflows authenticate to AWS only when explicitly configured via
  repository variables/secrets, and only call `ssm:SendCommand`.

## Application-level notes

- Passwords: scrypt with per-user random salt (Node `crypto`) — unchanged,
  still sound.
- Sessions: JWT in `cookie-session` cookie; `JWT_KEY` comes from a Kubernetes
  secret. Admin-only routes enforced server-side by the shared middleware.
- The seed script grants admin only via direct, operator-initiated DB access —
  the public signup API cannot create admins.

## Remaining known risks / recommendations

1. **NATS Streaming is deprecated** (EOL June 2023). It is pinned to the
   final 0.25.6 release and is **not exposed outside the cluster** (ClusterIP
   only), which contains the risk. Recommended next step: migrate the event
   bus to NATS JetStream — requires reworking the listener/publisher base
   classes in `@thasup-dev/common`, so it is out of scope for this revamp.
2. **`@thasup-dev/common` is stale** (pins express 4.17/jwt 8 era deps). The
   jsonwebtoken copy inside it is force-patched via npm overrides, but the
   package should be republished with updated dependencies (you own it).
3. **Single-node cluster**: by design (cost). The node is a single point of
   failure; EBS + optional MongoDB Atlas keep data safe, and `terraform apply`
   rebuilds the node from scratch in minutes. Scale path: move manifests to a
   managed cluster later — they are standard Kubernetes.
4. **Stripe Charges API**: the payment service still uses the legacy
   tokens + Charges flow (now via the maintained official SDKs). Stripe keeps
   it working for existing accounts; new accounts may require migrating to
   PaymentIntents eventually.
5. Consider adding rate limiting at the ingress (`nginx.ingress.kubernetes.io/limit-rps`)
   for the auth endpoints, and dependabot/renovate to keep this audit current.
