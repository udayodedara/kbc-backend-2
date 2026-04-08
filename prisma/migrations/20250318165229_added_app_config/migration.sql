-- CreateTable
CREATE TABLE "app_config" (
    "id" UUID NOT NULL,
    "terms_link" TEXT,
    "privacy_policy" TEXT,
    "minimum_suuported_version" TEXT,
    "disclaimer" TEXT,
    "play_store_url" TEXT,

    CONSTRAINT "app_config_pkey" PRIMARY KEY ("id")
);
