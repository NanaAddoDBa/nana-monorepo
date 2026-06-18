variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region for the Cloud Run service."
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name."
  type        = string
}

variable "image" {
  description = "Fully qualified container image reference."
  type        = string
}

variable "container_port" {
  description = "Container port exposed by the application."
  type        = number
  default     = 3000
}

variable "runtime_service_account_id" {
  description = "Account ID for the runtime service account created for this service."
  type        = string
}

variable "deployer_service_account_emails" {
  description = "Service account emails allowed to deploy revisions as the runtime identity."
  type        = set(string)
  default     = []
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

variable "cpu_idle" {
  description = "Whether CPU is allocated only while processing requests. Keep enabled for request-based billing."
  type        = bool
  default     = true
}

variable "startup_cpu_boost" {
  description = "Whether to temporarily boost CPU during container startup."
  type        = bool
  default     = false
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

variable "ingress" {
  description = "Cloud Run ingress setting."
  type        = string
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "allow_public_access" {
  description = "Whether to grant unauthenticated invoker access."
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Whether Terraform should prevent deleting the Cloud Run service."
  type        = bool
  default     = false
}

variable "labels" {
  description = "Labels applied to managed resources."
  type        = map(string)
  default     = {}
}
