-- Instant bookings are intentionally empty until a rental operator verifies each
-- physical vehicle, address, final rate, mandatory terms and deposit policy.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS verified_rental_vehicles (
  vehicle_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  pickup_location_id TEXT NOT NULL,
  daily_price_cents INTEGER NOT NULL CHECK (daily_price_cents > 0),
  mandatory_fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (mandatory_fee_cents >= 0),
  security_deposit_cents INTEGER NOT NULL DEFAULT 0 CHECK (security_deposit_cents >= 0),
  price_includes_tax BOOLEAN NOT NULL DEFAULT FALSE,
  pickup_address TEXT NOT NULL CHECK (length(trim(pickup_address)) >= 12),
  pickup_instructions TEXT NOT NULL CHECK (length(trim(pickup_instructions)) >= 12),
  mileage_policy TEXT NOT NULL CHECK (length(trim(mileage_policy)) >= 5),
  fuel_policy TEXT NOT NULL CHECK (length(trim(fuel_policy)) >= 5),
  cancellation_policy TEXT NOT NULL CHECK (length(trim(cancellation_policy)) >= 5),
  terms_version TEXT NOT NULL CHECK (length(trim(terms_version)) >= 3),
  active BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS paid_rental_reservations (
  id UUID PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  vehicle_id TEXT NOT NULL REFERENCES verified_rental_vehicles(vehicle_id),
  trip JSONB NOT NULL,
  pickup_at TIMESTAMPTZ NOT NULL,
  return_at TIMESTAMPTZ NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  total_amount_cents INTEGER NOT NULL CHECK (total_amount_cents > 0),
  security_deposit_cents INTEGER NOT NULL CHECK (security_deposit_cents >= 0),
  quote_snapshot JSONB NOT NULL,
  pickup_snapshot JSONB NOT NULL,
  terms_version TEXT NOT NULL,
  request_fingerprint CHAR(64) NOT NULL,
  idempotency_key UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'creating' CHECK (
    status IN ('creating','pending_payment','confirmed','picked_up','completed',
               'expired','cancelled','refund_required')
  ),
  stripe_session_id TEXT UNIQUE,
  stripe_session_url TEXT,
  stripe_payment_intent_id TEXT,
  session_expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (pickup_at < return_at)
);

-- PostgreSQL enforces exclusive occupancy, even across simultaneous requests.
-- Do not release pending Stripe holds by wall-clock alone: late settlement
-- can happen. Expire after signed Stripe expiry events or reconciliation.
ALTER TABLE paid_rental_reservations
  ADD CONSTRAINT no_overlapping_active_rentals
  EXCLUDE USING gist (
    vehicle_id WITH =,
    tstzrange(pickup_at, return_at, '[)') WITH &&
  ) WHERE (status IN ('creating','pending_payment','confirmed','picked_up'));

CREATE INDEX IF NOT EXISTS paid_reservations_status_idx
  ON paid_rental_reservations(status, session_expires_at);

CREATE TABLE IF NOT EXISTS rental_payment_events (
  stripe_event_id TEXT PRIMARY KEY,
  reservation_id UUID REFERENCES paid_rental_reservations(id),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rental_booking_notifications (
  id BIGSERIAL PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES paid_rental_reservations(id) ON DELETE CASCADE,
  recipient_kind TEXT NOT NULL CHECK(recipient_kind IN ('customer','operator')),
  attempts SMALLINT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  last_error TEXT,
  UNIQUE(reservation_id, recipient_kind)
);

CREATE INDEX IF NOT EXISTS rental_booking_notifications_pending_idx
  ON rental_booking_notifications(next_attempt_at)
  WHERE delivered_at IS NULL AND attempts < 5;
