variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name to monitor."
  type        = string
}

variable "service_uri" {
  description = "Public HTTPS URI of the Cloud Run service."
  type        = string

  validation {
    condition     = startswith(var.service_uri, "https://")
    error_message = "service_uri must be a public HTTPS URL."
  }
}

variable "health_path" {
  description = "Public health endpoint used by the uptime check."
  type        = string
  default     = "/api/health"

  validation {
    condition     = startswith(var.health_path, "/")
    error_message = "health_path must begin with a slash."
  }
}

variable "notification_email" {
  description = "Optional email address for monitoring notifications."
  type        = string
  default     = null
  nullable    = true
}

variable "uptime_period" {
  description = "Interval between uptime checks."
  type        = string
  default     = "300s"
}

variable "uptime_timeout" {
  description = "Timeout for each uptime check."
  type        = string
  default     = "10s"
}

variable "labels" {
  description = "Labels applied to monitoring resources."
  type        = map(string)
  default     = {}
}
