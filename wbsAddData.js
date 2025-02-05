import prisma from "./src/lib/prisma.js";

const createTasks = async () => {
  try {
    await prisma.wBSActivity.createMany({
      data: [
        {
          type: "MODELING",
          name: "Grid Placement",
        },
        {
          type: "MODELING",
          name: "MP - Wall & Panel Placement",
        },
        {
          type: "MODELING",
          name: "MP - Column Placement",
        },
        {
          type: "MODELING",
          name: "Base Plate",
        },
        {
          type: "MODELING",
          name: "MP - Beam Placement",
        },
        {
          type: "MODELING",
          name: "MP - Material Attachment",
        },
        {
          type: "MODELING",
          name: "MP - Joist Placement",
        },
        {
          type: "MODELING",
          name: "MP - Lintel",
        },
        {
          type: "MODELING",
          name: "MP - Embed Placement",
        },
        {
          type: "MODELING",
          name: "MP - Girt & Purlin Placement",
        },
        {
          type: "MODELING",
          name: "MP - Jamb & Header Placement",
        },
        {
          type: "MODELING",
          name: "MP - Brace Placement",
        },
        {
          type: "MODELING",
          name: "MP - Truss Placement",
        },
        {
          type: "MODELING",
          name: "MP - Sag Rod Placement",
        },
        {
          type: "MODELING",
          name: "MP - Grating & Checkered Plate Placement",
        },
        {
          type: "MODELING",
          name: "MP- Misc",
        },
        {
          type: "MODELING",
          name: "MP - Stair Placement & Connection",
        },
        {
          type: "MODELING",
          name: "MP - Ladder Placement & Connection",
        },
        {
          type: "MODELING",
          name: "MP - Hand Rail Placement & Connection",
        },
        {
          type: "MODELING",
          name: "RTU & Opening Frame Placement & Connection",
        },
        {
          type: "MODELING",
          name: "Connection of Column",
        },
        {
          type: "MODELING",
          name: "Connection of Beam",
        },
        {
          type: "MODELING",
          name: "Connection of Jamb & Header",
        },
        {
          type: "MODELING",
          name: "Connection of Brace",
        },
        {
          type: "MODELING",
          name: "Connection of Truss",
        },
        {
          type: "MODELING",
          name: "Connection of Girt & Purlin",
        },
        {
          type: "MODELING",
          name: "Connection of Joist",
        },
        {
          type: "ERECTION",
          name: "Erection of AB Plans",
        },
        {
          type: "ERECTION",
          name: "Erection of Embed Plans",
        },
        {
          type: "ERECTION",
          name: "Erection of Embed Sections",
        },
        {
          type: "ERECTION",
          name: "Erection of Main Steel Plans",
        },
        {
          type: "ERECTION",
          name: "Erection of Main Steel Elevations",
        },
        {
          type: "ERECTION",
          name: "Erection of Main Steel Sections",
        },
        {
          type: "ERECTION",
          name: "Erection of Misc Steel Plans",
        },
        {
          type: "ERECTION",
          name: "Erection of Misc Steel Elevations",
        },
        {
          type: "ERECTION",
          name: "Erection of Misc Steel Sections",
        },
        {
          type: "DETAILING",
          name: "Detailing of AB Plans",
        },
        {
          type: "DETAILING",
          name: "Embed Detailing",
        },
        {
          type: "DETAILING",
          name: "Main Steel Sheet loading",
        },
        {
          type: "DETAILING",
          name: "Column Detailing",
        },
        {
          type: "DETAILING",
          name: "Beam Detailing",
        },
        {
          type: "DETAILING",
          name: "Lintel Detailing",
        },
        {
          type: "DETAILING",
          name: "Jamb",
        },
        {
          type: "DETAILING",
          name: "Header",
        },
        {
          type: "DETAILING",
          name: "Horizontal Brace",
        },
        {
          type: "DETAILING",
          name: "Vertical Brace",
        },
        {
          type: "DETAILING",
          name: "Girt",
        },
        {
          type: "DETAILING",
          name: "Sag Rod",
        },
        {
          type: "DETAILING",
          name: "Misc Sheet Loading",
        },
        {
          type: "DETAILING",
          name: "Plate/ Grating",
        },
        {
          type: "DETAILING",
          name: "Pour Stop (Loose)",
        },
        {
          type: "DETAILING",
          name: "Kicker",
        },
        {
          type: "DETAILING",
          name: "Loose Plate",
        },
        {
          type: "DETAILING",
          name: "Deck Support Angle",
        },
        {
          type: "DETAILING",
          name: "Loose Lintel",
        },
        {
          type: "DETAILING",
          name: "Gates",
        },
        {
          type: "DETAILING",
          name: "Stair",
        },
        {
          type: "DETAILING",
          name: "Spiral Stair",
        },
        {
          type: "DETAILING",
          name: "Ladder",
        },
        {
          type: "DETAILING",
          name: "Hand Rail",
        },
        {
          type: "DETAILING",
          name: "RTU & opening Frame",
        },
        {
          type: "DETAILING",
          name: "Bollards",
        },
        {
          type: "DETAILING",
          name: "Plate/ Grating",
        },
      ],
      skipDuplicates: true, // Prevents duplicate entries
    });

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createTasks();
