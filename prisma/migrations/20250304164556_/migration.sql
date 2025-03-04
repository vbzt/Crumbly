/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `employees_phone_key` ON `employees`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `employees_email_key` ON `employees`(`email`);
