import prisma from "../lib/prisma.js";
import { Parser } from "json2csv";

const exportcvs=async(req,res)=>{

    const modelMap={
        users:prisma.users,
        projects:prisma.project,
        tasks:prisma.task,
        workingHours:prisma.workingHours,  
        fabricators:prisma.fabricator,
        department:prisma.department,
        team:prisma.team,
        comments:prisma.comment,
        submittals:prisma.submittals,
        rfis:prisma.rFI,
        rfqs:prisma.rFQ,
        changeOrders:prisma.changeOrder
    }
    const {model}=req.params;
    console.log("Req.Params",model);
try{
    const prismaModel=modelMap[model];
    console.log("Prisma Model",prismaModel)
    if(!prismaModel){
        return res.status(400).json({message:"Invalid model name"})
    }

     const data= await prismaModel.findMany();
    if(data.length===0){
        return res.status(401).json({message:"No data found"})
    }
    const jsonParser= new Parser();
    const csv=jsonParser.parse(data);

    res.header("Content-Type","text/csv")
    res.attachment(`${model}.csv`)
    res.send(csv)

}catch(error){
    console.error("❌ Error exporting CSV:", error);
    res.status(500).json({ message: "Error generating CSV" });
}

}
export {exportcvs};