locals {
  # Graviton instance families end the generation digits with a "g"
  # (t4g, m6g, m7gd, c7gn, r8g, ...) — everything else is amd64.
  ami_architecture = can(regex("^[a-z]+[0-9]+g", var.instance_type)) ? "arm64" : "amd64"

  # In-cluster fallbacks match the Service names in infra/k8s-local-db.
  mongo_uri_user    = var.mongo_uri_user != "" ? var.mongo_uri_user : "mongodb://user-mongo-srv:27017/users-db"
  mongo_uri_product = var.mongo_uri_product != "" ? var.mongo_uri_product : "mongodb://product-mongo-srv:27017/products-db"
  mongo_uri_order   = var.mongo_uri_order != "" ? var.mongo_uri_order : "mongodb://order-mongo-srv:27017/orders-db"
  mongo_uri_payment = var.mongo_uri_payment != "" ? var.mongo_uri_payment : "mongodb://payment-mongo-srv:27017/payments-db"
}

# Canonical publishes the latest Ubuntu AMI IDs as public SSM parameters:
# /aws/service/canonical/ubuntu/server/<version>/stable/current/<arch>/hvm/ebs-gp3/ami-id
data "aws_ssm_parameter" "ubuntu_ami" {
  name = "/aws/service/canonical/ubuntu/server/24.04/stable/current/${local.ami_architecture}/hvm/ebs-gp3/ami-id"
}

resource "aws_instance" "node" {
  ami                    = data.aws_ssm_parameter.ubuntu_ami.value
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.public.ids[0]
  vpc_security_group_ids = [aws_security_group.node.id]
  iam_instance_profile   = aws_iam_instance_profile.node.name

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.root_volume_size_gb
    delete_on_termination = true
    encrypted             = true
  }

  # Require IMDSv2 — blocks SSRF-style credential theft from pods.
  metadata_options {
    http_tokens                 = "required"
    http_endpoint               = "enabled"
    http_put_response_hop_limit = 2
  }

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    domain                   = var.domain
    acme_email               = var.acme_email
    git_repo                 = var.git_repo
    git_ref                  = var.git_ref
    docker_registry          = var.docker_registry
    use_in_cluster_databases = var.use_in_cluster_databases
    jwt_key                  = var.jwt_key
    mongo_uri_user           = local.mongo_uri_user
    mongo_uri_product        = local.mongo_uri_product
    mongo_uri_order          = local.mongo_uri_order
    mongo_uri_payment        = local.mongo_uri_payment
    stripe_key               = var.stripe_key
    paypal_client_id         = var.paypal_client_id
    stripe_publishable_key   = var.stripe_publishable_key
    paypal_public_client_id  = var.paypal_public_client_id != "" ? var.paypal_public_client_id : var.paypal_client_id
    ga_id                    = var.ga_id
  })

  # Changing user_data alone should not destroy the node (and its data);
  # re-run the bootstrap manually via SSM if you need to.
  user_data_replace_on_change = false

  tags = {
    Name = "${var.project_name}-node"
  }
}
