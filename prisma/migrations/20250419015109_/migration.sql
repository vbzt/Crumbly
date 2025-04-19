/*
  Warnings:

  - You are about to alter the column `quantity` on the `tab_items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `tab_items` MODIFY `quantity` DECIMAL(10, 2) NOT NULL;
