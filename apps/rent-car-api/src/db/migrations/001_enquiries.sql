CREATE TABLE IF NOT EXISTS rental_enquiries (
  id UUID PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE,
  idempotency_key UUID NOT NULL UNIQUE,
  fingerprint CHAR(64) NOT NULL,
  vehicle_id VARCHAR(80) NOT NULL,
  trip JSONB NOT NULL,
  quote JSONB NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL DEFAULT '',
  customer_message VARCHAR(1000) NOT NULL DEFAULT '',
  status VARCHAR(32) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','under_review','quoted','confirmed','declined','cancelled','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rental_enquiries_created_idx
  ON rental_enquiries (created_at DESC);

CREATE TABLE IF NOT EXISTS notification_outbox (
  id BIGSERIAL PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES rental_enquiries(id) ON DELETE CASCADE,
  recipient_kind VARCHAR(16) NOT NULL CHECK (recipient_kind IN ('operator','customer')),
  attempts SMALLINT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  last_error TEXT,
  UNIQUE (enquiry_id, recipient_kind)
);

CREATE INDEX IF NOT EXISTS notification_outbox_pending_idx
  ON notification_outbox (next_attempt_at)
  WHERE delivered_at IS NULL AND attempts < 5;
