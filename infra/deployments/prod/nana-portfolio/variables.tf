variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region."
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name."
  type        = string
}

variable "artifact_registry_repository" {
  description = "Artifact Registry repository used for application images."
  type        = string
}

variable "image" {
  description = "Optional full image reference. Defaults to the app image in the configured Artifact Registry repository."
  type        = string
  default     = null
}

variable "container_port" {
  description = "Container port exposed by the application."
  type        = number
  default     = 3000
}

variable "runtime_service_account_id" {
  description = "Account ID for the Cloud Run runtime service account."
  type        = string
}

variable "env_vars" {
  description = "Plain environment variables passed to the container."
  type        = map(string)
  default     = {}
}

variable "secret_env_vars" {
  description = "Secret Manager-backed environment variables passed to the container."
  type = map(object({
    secret_name = string
    version     = optional(string, "latest")
  }))
  default = {}
}

variable "cpu" {
  description = "CPU limit for the container."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory limit for the container."
  type        = string
  default     = "512Mi"
}

variable "timeout_seconds" {
  description = "Request timeout in seconds."
  type        = number
  default     = 60
}

variable "max_instance_request_concurrency" {
  description = "Maximum concurrent requests per instance."
  type        = number
  default     = 80
}

variable "min_instance_count" {
  description = "Minimum number of Cloud Run instances."
  type        = number
  default     = 0
}

variable "max_instance_count" {
  description = "Maximum number of Cloud Run instances."
  type        = number
  default     = 3
}

variable "allow_public_access" {
  description = "Whether to grant unauthenticated invoker access."
  type        = bool
  default     = true
}

variable "labels" {
  description = "Labels applied to managed resources."
  type        = map(string)
  default     = {}
}
