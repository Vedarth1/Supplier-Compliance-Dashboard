/*
  Warnings:

  - You are about to drop the `ComplianceRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComplianceRecord" DROP CONSTRAINT "ComplianceRecord_supplier_id_fkey";

-- DropTable
DROP TABLE "ComplianceRecord";

-- DropTable
DROP TABLE "Supplier";

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "contract_terms" JSONB NOT NULL,
    "compliance_score" INTEGER NOT NULL,
    "last_audit" TIMESTAMP(3),

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliancerecord" (
    "id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "metric" TEXT NOT NULL,
    "date_recorded" TIMESTAMP(3) NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "compliancerecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "compliancerecord" ADD CONSTRAINT "compliancerecord_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
