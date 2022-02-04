/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `County` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "County_name_key" ON "County"("name");
