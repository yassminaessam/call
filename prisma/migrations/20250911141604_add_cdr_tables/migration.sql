-- CreateEnum
CREATE TYPE "CDRMode" AS ENUM ('HTTPS', 'TCP');

-- CreateTable
CREATE TABLE "cdr" (
    "id" BIGSERIAL NOT NULL,
    "calldate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "src" VARCHAR(64),
    "dst" VARCHAR(64),
    "disposition" VARCHAR(20),
    "duration" INTEGER DEFAULT 0,
    "billsec" INTEGER DEFAULT 0,
    "actionType" VARCHAR(64),
    "accountcode" VARCHAR(64),
    "uniqueid" VARCHAR(128) NOT NULL,
    "channel" VARCHAR(128),
    "dcontext" VARCHAR(80),
    "dstchannel" VARCHAR(128),
    "lastapp" VARCHAR(80),
    "lastdata" VARCHAR(200),
    "amaflags" INTEGER DEFAULT 0,
    "userfield" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdr_connector_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mode" "CDRMode" NOT NULL DEFAULT 'HTTPS',
    "jsonConfig" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cdr_connector_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cdr_uniqueid_key" ON "cdr"("uniqueid");

-- CreateIndex
CREATE INDEX "cdr_calldate_idx" ON "cdr"("calldate");

-- CreateIndex
CREATE INDEX "cdr_src_idx" ON "cdr"("src");

-- CreateIndex
CREATE INDEX "cdr_dst_idx" ON "cdr"("dst");

-- CreateIndex
CREATE INDEX "cdr_disposition_idx" ON "cdr"("disposition");

-- CreateIndex
CREATE INDEX "cdr_duration_idx" ON "cdr"("duration");
