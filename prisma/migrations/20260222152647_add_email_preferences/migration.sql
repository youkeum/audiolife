-- AlterTable
ALTER TABLE "public"."EmailSubscription" ADD COLUMN     "announcementEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newPostEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "replyNotificationEnabled" BOOLEAN NOT NULL DEFAULT false;
