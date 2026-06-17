data "google_project" "current" {
  project_id = var.project_id
}

data "google_artifact_registry_repository" "apps" {
  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_repository
}

locals {
  secret_names = toset([
    for secret_config in values(var.secret_env_vars) : secret_config.secret_name
  ])
}

data "google_secret_manager_secret" "runtime" {
  for_each = local.secret_names

  project   = var.project_id
  secret_id = each.key
}
