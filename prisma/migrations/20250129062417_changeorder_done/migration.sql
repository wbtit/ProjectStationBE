-- CreateTable
CREATE TABLE "changeorder" (
    "id" UUID NOT NULL,
    "project" UUID NOT NULL,
    "recipients" UUID NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT '',
    "changeOrder" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT NOT NULL DEFAULT '',
    "rows" JSONB NOT NULL DEFAULT '[]',
    "files" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "changeorder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_project_fkey" FOREIGN KEY ("project") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changeorder" ADD CONSTRAINT "changeorder_recipients_fkey" FOREIGN KEY ("recipients") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
