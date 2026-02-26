-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('Gold', 'Silver', 'Bronze', 'Guest');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'owner');

-- CreateEnum
CREATE TYPE "SongSource" AS ENUM ('local', 'deezer', 'itunes');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('queued', 'playing', 'completed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "membershipType" "MembershipType" NOT NULL DEFAULT 'Guest',
    "avatar" TEXT NOT NULL DEFAULT '',
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "lastPlayed" TIMESTAMP(3),
    "previewUrl" TEXT NOT NULL DEFAULT '',
    "source" "SongSource" NOT NULL DEFAULT 'local',
    "deezerId" INTEGER,
    "itunesTrackId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'queued',
    "queuePosition" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Song_deezerId_key" ON "Song"("deezerId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_itunesTrackId_key" ON "Song"("itunesTrackId");

-- CreateIndex
CREATE INDEX "Song_title_idx" ON "Song"("title");

-- CreateIndex
CREATE INDEX "Song_artist_idx" ON "Song"("artist");

-- CreateIndex
CREATE INDEX "Song_album_idx" ON "Song"("album");

-- CreateIndex
CREATE INDEX "Order_status_queuePosition_createdAt_idx" ON "Order"("status", "queuePosition", "createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_songId_idx" ON "Order"("songId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
