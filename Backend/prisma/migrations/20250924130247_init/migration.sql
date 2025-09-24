-- CreateTable
CREATE TABLE "public"."counter" (
    "count" INTEGER NOT NULL,
    "id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mapping_long_short_url" (
    "map_id" SERIAL NOT NULL,
    "original_url" VARCHAR(2048),
    "short_slug" VARCHAR(100),
    "username" VARCHAR(20),

    CONSTRAINT "mapping_long_short_url_pkey" PRIMARY KEY ("map_id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "public"."session"("expire");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- AddForeignKey
ALTER TABLE "public"."mapping_long_short_url" ADD CONSTRAINT "mapping_long_short_url_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
