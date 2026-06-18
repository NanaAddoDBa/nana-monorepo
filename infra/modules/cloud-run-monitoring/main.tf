locals {
  service_host = trimsuffix(trimprefix(var.service_uri, "https://"), "/")
  notification_channels = var.notification_email == null ? [] : [
    google_monitoring_notification_channel.email[0].name,
  ]
}

resource "google_monitoring_notification_channel" "email" {
  count = var.notification_email == null ? 0 : 1

  project      = var.project_id
  display_name = "${var.service_name} operations email"
  type         = "email"
  enabled      = true

  labels = {
    email_address = var.notification_email
  }

  user_labels = var.labels
}

resource "google_monitoring_uptime_check_config" "service" {
  project            = var.project_id
  display_name       = "${var.service_name} health"
  checker_type       = "STATIC_IP_CHECKERS"
  period             = var.uptime_period
  timeout            = var.uptime_timeout
  selected_regions   = ["EUROPE", "USA", "ASIA_PACIFIC"]
  log_check_failures = true
  user_labels        = var.labels

  monitored_resource {
    type = "uptime_url"

    labels = {
      project_id = var.project_id
      host       = local.service_host
    }
  }

  http_check {
    request_method = "GET"
    path           = var.health_path
    port           = 443
    use_ssl        = true
    validate_ssl   = true

    accepted_response_status_codes {
      status_value = 200
    }
  }

  content_matchers {
    content = "\"status\":\"ok\""
    matcher = "CONTAINS_STRING"
  }
}

resource "google_monitoring_alert_policy" "uptime" {
  project               = var.project_id
  display_name          = "${var.service_name} is unavailable"
  combiner              = "OR"
  enabled               = true
  severity              = "CRITICAL"
  notification_channels = local.notification_channels
  user_labels           = var.labels

  conditions {
    display_name = "Health check failed"

    condition_threshold {
      filter = join(" AND ", [
        "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\"",
        "resource.type=\"uptime_url\"",
        "metric.label.check_id=\"${google_monitoring_uptime_check_config.service.uptime_check_id}\"",
      ])
      comparison      = "COMPARISON_LT"
      threshold_value = 1
      duration        = "0s"

      aggregations {
        alignment_period   = var.uptime_period
        per_series_aligner = "ALIGN_NEXT_OLDER"
      }

      trigger {
        count = 1
      }
    }
  }

  alert_strategy {
    auto_close = "1800s"
  }

  documentation {
    mime_type = "text/markdown"
    subject   = "${var.service_name} failed its public health check"
    content   = "Check the Cloud Run service and recent deployment logs: ${var.service_uri}${var.health_path}"
  }
}

resource "google_monitoring_alert_policy" "errors" {
  project               = var.project_id
  display_name          = "${var.service_name} application errors"
  combiner              = "OR"
  enabled               = true
  severity              = "ERROR"
  notification_channels = local.notification_channels
  user_labels           = var.labels

  conditions {
    display_name = "Cloud Run error log detected"

    condition_matched_log {
      filter = join(" AND ", [
        "resource.type=\"cloud_run_revision\"",
        "resource.labels.service_name=\"${var.service_name}\"",
        "severity>=ERROR",
      ])
    }
  }

  alert_strategy {
    auto_close = "1800s"

    notification_rate_limit {
      period = "900s"
    }
  }

  documentation {
    mime_type = "text/markdown"
    subject   = "${var.service_name} emitted an error log"
    content   = "Review Cloud Run request and application logs for service `${var.service_name}` in `${var.project_id}`."
  }
}
