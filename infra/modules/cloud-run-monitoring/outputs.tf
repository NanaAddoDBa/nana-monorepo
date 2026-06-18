output "uptime_check_id" {
  description = "Identifier of the service uptime check."
  value       = google_monitoring_uptime_check_config.service.uptime_check_id
}

output "notification_channel_name" {
  description = "Notification channel resource name, when email notifications are configured."
  value       = try(google_monitoring_notification_channel.email[0].name, null)
}
