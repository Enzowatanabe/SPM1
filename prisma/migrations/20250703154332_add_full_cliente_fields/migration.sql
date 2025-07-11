/*
  Warnings:

  - You are about to drop the column `cpfCnpj` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `celular` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT,
    "cpf" TEXT,
    "rg" TEXT,
    "enderecoEntrega" TEXT,
    "numeroEntrega" TEXT,
    "aptoEntrega" TEXT,
    "bairroEntrega" TEXT,
    "enderecoResidencial" TEXT,
    "numeroResidencial" TEXT,
    "aptoResidencial" TEXT,
    "bairroResidencial" TEXT,
    "valorTotal" TEXT,
    "valorSinal" TEXT,
    "dataSinal" TEXT,
    "parcelas" INTEGER,
    "descricao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cliente" ("createdAt", "email", "id", "nome") SELECT "createdAt", "email", "id", "nome" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
