-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parcela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Parcela_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Parcela" ("clienteId", "createdAt", "data", "id", "valor") SELECT "clienteId", "createdAt", "data", "id", "valor" FROM "Parcela";
DROP TABLE "Parcela";
ALTER TABLE "new_Parcela" RENAME TO "Parcela";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
