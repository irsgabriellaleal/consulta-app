/*
  Warnings:

  - Added the required column `senha` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `nome` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    MODIFY `nome` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Medico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `especialidade` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `Agendamento` RENAME INDEX `Agendamento_usuarioId_fkey` TO `Agendamento_usuarioId_idx`;
