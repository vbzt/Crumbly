/*
  Warnings:

  - You are about to drop the column `Tab_id` on the `tab_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `resetPasswordToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Sale_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Sales` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Tab` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `tab_items` will be added. If there are existing duplicate values, this will fail.
  - Made the column `closedAt` on table `tab` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tab_id` to the `tab_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tab_items` DROP FOREIGN KEY `tab_items_Tab_id_fkey`;

-- DropIndex
DROP INDEX `tab_items_Tab_id_idx` ON `tab_items`;

-- AlterTable
ALTER TABLE `tab` MODIFY `closedAt` TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE `tab_items` DROP COLUMN `Tab_id`,
    ADD COLUMN `tab_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employees_id_key` ON `Employees`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `resetPasswordToken_id_key` ON `resetPasswordToken`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Sale_items_id_key` ON `Sale_items`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Sales_id_key` ON `Sales`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Stock_id_key` ON `Stock`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Tab_id_key` ON `Tab`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `tab_items_id_key` ON `tab_items`(`id`);

-- CreateIndex
CREATE INDEX `tab_items_tab_id_idx` ON `tab_items`(`tab_id`);

-- AddForeignKey
ALTER TABLE `tab_items` ADD CONSTRAINT `tab_items_tab_id_fkey` FOREIGN KEY (`tab_id`) REFERENCES `Tab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
