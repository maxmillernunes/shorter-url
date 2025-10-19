-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "short_urls" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alias" TEXT,
    "access_counter" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_slug_key" ON "short_urls"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "short_urls_alias_key" ON "short_urls"("alias");

-- CreateIndex
CREATE INDEX "short_urls_slug_idx" ON "short_urls"("slug");

-- CreateIndex
CREATE INDEX "short_urls_alias_idx" ON "short_urls"("alias");

-- AddForeignKey
ALTER TABLE "short_urls" ADD CONSTRAINT "short_urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
