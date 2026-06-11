# Cheapest possible networking: reuse the account's default VPC and one of
# its public subnets. No NAT gateway (~$32/mo saved), no load balancer
# (~$16/mo saved — ingress-nginx binds 80/443 directly on the node), no EKS
# control plane (~$73/mo saved).

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  # Default-VPC subnets map public IPs automatically; any of them works.
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

resource "aws_security_group" "node" {
  name        = "${var.project_name}-node"
  description = "Single-node k3s host for ${var.project_name}"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP (ACME challenges + redirect to HTTPS)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH and the k3s API stay closed unless an admin CIDR is provided.
  # Day-to-day shell access goes through SSM Session Manager instead.
  dynamic "ingress" {
    for_each = var.admin_cidr != "" ? [22, 6443] : []
    content {
      description = "Admin access (port ${ingress.value}) from admin_cidr"
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = [var.admin_cidr]
    }
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-node"
  }
}

# Elastic IP: free while attached to a running instance. Gives the domain a
# stable A-record target that survives instance replacement.
resource "aws_eip" "node" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-node"
  }
}

resource "aws_eip_association" "node" {
  instance_id   = aws_instance.node.id
  allocation_id = aws_eip.node.id
}
