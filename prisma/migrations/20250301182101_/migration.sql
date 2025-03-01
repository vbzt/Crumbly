/*
  Warnings:

  - Added the required column `unit_of_measurement` to the `stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock` ADD COLUMN `unit_of_measurement` VARCHAR(191) NOT NULL;
