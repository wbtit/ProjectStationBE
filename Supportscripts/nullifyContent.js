import prisma from "../src/lib/prisma.js";

async function nullifyAllContent() {
  console.log("Starting to set all 'content' values to NULL...");

  try {
    const result = await prisma.$executeRaw`
      UPDATE "message"
      SET content = NULL;
    `;

    console.log(`Successfully set 'content' to NULL for ${result} records.`);
    console.log("All 'content' values should now be NULL.");
  } catch (error) {
    console.error("An error occurred while nullifying 'content':", error.message);
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
}

nullifyAllContent();