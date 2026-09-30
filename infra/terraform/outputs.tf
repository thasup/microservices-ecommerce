output "public_ip" {
  description = "Elastic IP of the k3s node."
  value       = aws_eip.node.public_ip
}

output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.node.id
}

output "dns_reminder" {
  description = "Action required after apply."
  value       = "Create an A record: ${var.domain} -> ${aws_eip.node.public_ip} (TLS is issued automatically once DNS resolves)."
}

output "app_url" {
  description = "Public URL of the shop once DNS propagates."
  value       = "https://${var.domain}"
}

output "ssm_session_command" {
  description = "Open a shell on the node (no SSH needed)."
  value       = "aws ssm start-session --target ${aws_instance.node.id} --region ${var.aws_region}"
}

output "bootstrap_log_hint" {
  description = "Where to watch the first-boot bootstrap."
  value       = "Inside the SSM session: sudo tail -f /var/log/user-data.log"
}
