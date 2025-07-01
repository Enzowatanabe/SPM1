-- CreateTable
CREATE TABLE "Orcamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cliente" TEXT NOT NULL,
    "projeto" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" TEXT NOT NULL
);
