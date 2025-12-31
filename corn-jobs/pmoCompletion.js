import nodeCron from "node-cron";
import prisma from "../src/lib/prisma.js";
import sendIFACompletionAlertPMO from "../service/sendIFACompletionAlertPMO.js";
import sendIFCCompletionAlertPMO from "../service/gmailservice/sendIFCCompletionAlertPMO.js";

export async function runPMOCompletionCheck() {
  console.log("[CRON] PMO completion check running...");

  const projects = await prisma.project.findMany({
    include: {
      mileStones: true,
      submittals:true
    }
  });

  for (const project of projects) {

    if (!project.fabricatorID) continue;

    let totalIFA = 0, completedIFA = 0;
    let totalIFC = 0, completedIFC = 0;

    //milestone
    for(const milestone of project.mileStones){
      if(milestone.stage ==="IFA"){
        totalIFA++
      }
      if(milestone.stage ==="IFC"){
        totalIFC++
      }
    }
    //submittal
    for(const submittal of project.submittals){
      if(submittal.stage ==="IFA"){
        completedIFA++
      }
      if(submittal.stage ==="IFC"){
        completedIFC++
      }
    }

    

    const IFACompletion = totalIFA === 0 ? 0 : (completedIFA / totalIFA) * 100;
    const IFCCompletion = totalIFC === 0 ? 0 : (completedIFC / totalIFC) * 100;
    
    await prisma.project.update({
      where: { id: project.id },
      data: {
        IFAComepletionPercentage: IFACompletion,
        IFCompletionPercentage: IFCCompletion
      }
    
    })


    // IFA Invoice Alert
    if (
      IFACompletion === 100 &&
      !project.IFACompletionAlertSent
    ) {
      await sendIFACompletionAlertPMO(project, fabricator);
      await prisma.project.update({
        where: { id: project.id },
        data: { IFACompletionAlertSent: true }
      });
    }

    // IFC Invoice Alert
    if (
      IFCCompletion === 100 &&
      !project.IFCCompletionAlertSent
    ) {
      await sendIFCCompletionAlertPMO(project, fabricator);
      await prisma.project.update({
        where: { id: project.id },
        data: { IFCCompletionAlertSent: true }
      });
    }
  }
}

// Every 1 hour
// nodeCron.schedule(
//   "0 * * * *",
//   () => runPMOCompletionCheck(),
//   { timezone: "Asia/Kolkata" }
// );
// TEMP: every 1 minute for testing
nodeCron.schedule(
  "*/1 * * * *",
  () => runPMOCompletionCheck(),
  { timezone: "Asia/Kolkata" }
);
