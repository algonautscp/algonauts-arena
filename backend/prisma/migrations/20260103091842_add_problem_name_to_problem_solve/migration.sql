-- AlterTable
ALTER TABLE "ProblemSolve" ADD COLUMN     "problemName" TEXT;

-- Update existing rows with a default value
UPDATE "ProblemSolve" SET "problemName" = 'Unknown Problem' WHERE "problemName" IS NULL;

-- AlterTable
ALTER TABLE "ProblemSolve" ALTER COLUMN "problemName" SET NOT NULL;
