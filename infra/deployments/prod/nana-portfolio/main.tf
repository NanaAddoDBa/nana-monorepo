locals {
  image = coalesce(
    var.image,
    "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_registry_repository}/${var.service_name}:latest"
  )
}

module "cloud_run_service" {
  source = "../../../modules/cloud-run-service"

  project_id                       = var.project_id
  region                           = var.region
  service_name                     = var.service_name
  image                            = local.image
  container_port                   = var.container_port
  runtime_service_account_id       = var.runtime_service_account_id
  env_vars                         = var.env_vars
  secret_env_vars                  = var.secret_env_vars
  cpu                              = var.cpu
  memory                           = var.memory
  timeout_seconds                  = var.timeout_seconds
  max_instance_request_concurrency = var.max_instance_request_concurrency
  min_instance_count               = var.min_instance_count
  max_instance_count               = var.max_instance_count
  allow_public_access              = var.allow_public_access
  labels                           = var.labels

  depends_on = [
    data.google_secret_manager_secret.runtime,
  ]
}
