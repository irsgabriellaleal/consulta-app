/*
  Warnings:

  - Added the required column `nomeMedico` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Agendamento` ADD COLUMN `nomeMedico` VARCHAR(191) NOT NULL;
