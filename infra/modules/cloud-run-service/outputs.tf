output "service_name" {
  description = "Cloud Run service name."
  value       = google_cloud_run_v2_service.this.name
}

output "service_uri" {
  description = "Cloud Run service URI."
  value = (
    google_cloud_run_v2_service.this.uri != "" ?
    google_cloud_run_v2_service.this.uri :
    try(google_cloud_run_v2_service.this.urls[0], "")
  )
}

output "runtime_service_account_email" {
  description = "Runtime service account email."
  value       = google_service_account.runtime.email
}
