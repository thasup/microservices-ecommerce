variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for all AWS resources."
  type        = string
  default     = "aurapan"
}

variable "instance_type" {
  description = <<-EOT
    EC2 instance type. Defaults to t4g.small (2 vCPU / 2 GiB, ARM Graviton,
    ~$12.26/mo on-demand in us-east-1) — the cheapest type that comfortably
    runs the full stack. Alternatives:
      - t4g.micro (~$6.13/mo): works for light traffic if databases run in
        MongoDB Atlas instead of in-cluster.
      - t3a.small (~$13.69/mo): x86 equivalent if you need amd64 images.
    The AMI architecture automatically follows the instance family
    (Graviton families like t4g/m7g/c7g get arm64, everything else amd64),
    so the Docker images you publish must match: the default thasup/* images
    are built multi-arch by CI.
  EOT
  type        = string
  default     = "t4g.small"
}

variable "root_volume_size_gb" {
  description = "Root EBS (gp3) volume size in GB. 20 GB ≈ $1.60/mo."
  type        = number
  default     = 20
}

variable "admin_cidr" {
  description = <<-EOT
    Optional CIDR (e.g. "203.0.113.7/32") allowed to reach SSH (22) and the
    k3s API (6443). Leave empty (default) to keep both ports closed — shell
    access then goes through AWS SSM Session Manager, which needs no inbound
    ports at all.
  EOT
  type        = string
  default     = ""
}

variable "domain" {
  description = "Public domain for the shop (e.g. shop.example.com). Point its A record at the output elastic IP."
  type        = string
}

variable "acme_email" {
  description = "Email address registered with Let's Encrypt for TLS certificate expiry notices."
  type        = string
}

variable "git_repo" {
  description = "Git repository the instance clones to get the Kubernetes manifests."
  type        = string
  default     = "https://github.com/thasup/microservices-ecommerce.git"
}

variable "git_ref" {
  description = "Git branch/tag to deploy."
  type        = string
  default     = "main"
}

variable "docker_registry" {
  description = "Docker Hub namespace the deployment images are pulled from (CI pushes <registry>/user, <registry>/product, ...)."
  type        = string
  default     = "thasup"
}

variable "use_in_cluster_databases" {
  description = <<-EOT
    true  (default): also apply infra/k8s-local-db — MongoDB runs in-cluster
           on the node's EBS volume. Zero extra cost, but durability is tied
           to the single node/volume.
    false: skip in-cluster MongoDB. You must then provide all four
           mongo_uri_* variables (MongoDB Atlas M0 is free and recommended
           for production durability).
    Redis (expiration queue) always runs in-cluster either way — it holds
    only ephemeral timer state.
  EOT
  type        = bool
  default     = true
}

variable "jwt_key" {
  description = "Secret key used to sign JWT session tokens (any long random string)."
  type        = string
  sensitive   = true
}

variable "mongo_uri_user" {
  description = "MongoDB connection string for the user service. Empty = in-cluster default (mongodb://user-mongo-srv:27017/users-db)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "mongo_uri_product" {
  description = "MongoDB connection string for the product service. Empty = in-cluster default."
  type        = string
  default     = ""
  sensitive   = true
}

variable "mongo_uri_order" {
  description = "MongoDB connection string for the order service. Empty = in-cluster default."
  type        = string
  default     = ""
  sensitive   = true
}

variable "mongo_uri_payment" {
  description = "MongoDB connection string for the payment service. Empty = in-cluster default."
  type        = string
  default     = ""
  sensitive   = true
}

variable "stripe_key" {
  description = "Stripe secret API key (sk_...)."
  type        = string
  sensitive   = true
}

variable "paypal_client_id" {
  description = "PayPal client ID used by the payment service."
  type        = string
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Optional Stripe publishable key (pk_...) exposed to the storefront."
  type        = string
  default     = ""
}

variable "paypal_public_client_id" {
  description = "Optional PayPal client ID exposed to the storefront (usually the same value as paypal_client_id)."
  type        = string
  default     = ""
}

variable "ga_id" {
  description = "Optional Google Analytics measurement ID for the storefront."
  type        = string
  default     = ""
}
