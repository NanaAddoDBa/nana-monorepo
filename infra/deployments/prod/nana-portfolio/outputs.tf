output "project_number" {
  description = "Google Cloud project number."
  value       = data.google_project.current.number
}

output "service_name" {
  description = "Cloud Run service name."
  value       = module.cloud_run_service.service_name
}

output "service_uri" {
  description = "Cloud Run service URI."
  value       = module.cloud_run_service.service_uri
}

output "runtime_service_account_email" {
  description = "Runtime service account email."
  value       = module.cloud_run_service.runtime_service_account_email
}
