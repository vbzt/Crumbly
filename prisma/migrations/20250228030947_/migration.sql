/*
  Warnings:

  - Added the required column `password` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Made the column `role` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `employees` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `role` VARCHAR(45) NOT NULL;
