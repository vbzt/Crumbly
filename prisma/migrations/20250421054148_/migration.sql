-- AlterTable
ALTER TABLE `tab` ADD COLUMN `closed_by` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Tab` ADD CONSTRAINT `Tab_closed_by_fkey` FOREIGN KEY (`closed_by`) REFERENCES `Employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
