/*
  Warnings:

  - A unique constraint covering the columns `[tabId]` on the table `Sales` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tabId` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sales` ADD COLUMN `tabId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tab` ADD COLUMN `closedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Sales_tabId_key` ON `Sales`(`tabId`);

-- AddForeignKey
ALTER TABLE `Sales` ADD CONSTRAINT `Sales_tabId_fkey` FOREIGN KEY (`tabId`) REFERENCES `Tab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `sale_items` RENAME INDEX `Sale_items_product_id_fkey` TO `sale_items_product_id_fkey`;

-- RenameIndex
ALTER TABLE `sale_items` RENAME INDEX `Sale_items_sale_id_fkey` TO `sale_items_sale_id_fkey`;

-- RenameIndex
ALTER TABLE `sales` RENAME INDEX `Sales_employee_id_fkey` TO `sales_employee_id_fkey`;
