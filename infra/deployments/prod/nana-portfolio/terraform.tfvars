project_id                   = "nana-monorepo"
region                       = "europe-west3"
service_name                 = "nana-portfolio"
artifact_registry_repository = "apps"
runtime_service_account_id   = "nana-portfolio-runtime"
deployer_service_account_emails = [
  "terraform-deployer@nana-monorepo.iam.gserviceaccount.com",
  "github-cloud-run-deployer@nana-monorepo.iam.gserviceaccount.com",
]

container_port                   = 3000
cpu                              = "1"
memory                           = "512Mi"
cpu_idle                         = true
startup_cpu_boost                = false
timeout_seconds                  = 60
max_instance_request_concurrency = 80
min_instance_count               = 0
max_instance_count               = 1
allow_public_access              = true
deletion_protection              = false
health_path                      = "/api/health"
monitoring_notification_email    = "nanaaddoldoe@gmail.com"

env_vars = {
  NODE_ENV                = "production"
  NEXT_TELEMETRY_DISABLED = "1"
  RESEND_FROM_EMAIL       = "onboarding@resend.dev"
  CONTACT_RECEIVER_EMAIL  = "nanaaddoldoe@gmail.com"
}

secret_env_vars = {
  RESEND_API_KEY = {
    secret_name = "nana-portfolio-resend-api-key"
  }

  TELEGRAM_BOT_TOKEN = {
    secret_name = "nana-portfolio-telegram-bot-token"
  }

  TELEGRAM_CHAT_ID = {
    secret_name = "nana-portfolio-telegram-chat-id"
  }
}

labels = {
  app         = "nana-portfolio"
  managed_by  = "terraform"
  environment = "prod"
}
