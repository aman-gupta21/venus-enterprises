-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('RAZORPAY', 'UPI', 'CARD', 'NET_BANKING', 'CASH', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('BOOKING', 'PAYMENT', 'QUOTATION', 'ENQUIRY', 'GENERAL');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('IN_APP', 'EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "payment_number" VARCHAR(50) NOT NULL,
    "booking_id" UUID,
    "quotation_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "status" "payment_status" NOT NULL DEFAULT 'CREATED',
    "method" "payment_method",
    "provider_order_id" VARCHAR(150),
    "provider_payment_id" VARCHAR(150),
    "idempotency_key" VARCHAR(100) NOT NULL,
    "failure_reason" TEXT,
    "paid_at" TIMESTAMPTZ(3),
    "refunded_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "profile_id" UUID,
    "type" "notification_type" NOT NULL,
    "channel" "notification_channel" NOT NULL,
    "status" "notification_status" NOT NULL DEFAULT 'PENDING',
    "title" VARCHAR(180) NOT NULL,
    "message" TEXT NOT NULL,
    "recipient" VARCHAR(255),
    "reference_id" UUID,
    "sent_at" TIMESTAMPTZ(3),
    "read_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "website_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(180),
    "industry" VARCHAR(120),
    "cover_image_url" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "description" TEXT,
    "certificate_number" VARCHAR(100),
    "document_url" TEXT,
    "issued_by" VARCHAR(180),
    "issued_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(120),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(120) NOT NULL,
    "entity_id" UUID,
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_order_id_key" ON "payments"("provider_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments"("provider_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");

-- CreateIndex
CREATE INDEX "payments_status_created_at_idx" ON "payments"("status", "created_at");

-- CreateIndex
CREATE INDEX "payments_booking_id_idx" ON "payments"("booking_id");

-- CreateIndex
CREATE INDEX "payments_quotation_id_idx" ON "payments"("quotation_id");

-- CreateIndex
CREATE INDEX "notifications_profile_id_created_at_idx" ON "notifications"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_status_created_at_idx" ON "notifications"("status", "created_at");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_booking_id_key" ON "reviews"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_service_id_is_published_idx" ON "reviews"("service_id", "is_published");

-- CreateIndex
CREATE INDEX "reviews_profile_id_idx" ON "reviews"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_slug_key" ON "clients"("slug");

-- CreateIndex
CREATE INDEX "clients_is_active_idx" ON "clients"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_is_published_is_featured_idx" ON "projects"("is_published", "is_featured");

-- CreateIndex
CREATE INDEX "projects_client_id_idx" ON "projects"("client_id");

-- CreateIndex
CREATE INDEX "certifications_is_active_idx" ON "certifications"("is_active");

-- CreateIndex
CREATE INDEX "faqs_is_published_sort_order_idx" ON "faqs"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit_logs"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payments"
ADD CONSTRAINT "payments_exactly_one_parent_check"
CHECK (
  ("booking_id" IS NOT NULL AND "quotation_id" IS NULL)
  OR
  ("booking_id" IS NULL AND "quotation_id" IS NOT NULL)
);

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_rating_range_check"
CHECK ("rating" BETWEEN 1 AND 5);

ALTER TABLE "payments"
ADD CONSTRAINT "payments_amount_positive_check"
CHECK ("amount" > 0);
