/*
  Warnings:

  - You are about to drop the `tabitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tabitem` DROP FOREIGN KEY `TabItem_Tab_id_fkey`;

-- DropForeignKey
ALTER TABLE `tabitem` DROP FOREIGN KEY `TabItem_product_id_fkey`;

-- DropTable
DROP TABLE `tabitem`;

-- CreateTable
CREATE TABLE `tab_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Tab_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    INDEX `tab_items_Tab_id_idx`(`Tab_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tab_items` ADD CONSTRAINT `tab_items_Tab_id_fkey` FOREIGN KEY (`Tab_id`) REFERENCES `Tab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tab_items` ADD CONSTRAINT `tab_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Stock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
