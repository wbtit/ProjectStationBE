import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getWbsActivityByStage=async(req,res)=>{
  try {
    const{projectID}=req.params
    const {stage,type}=req.body

    if(!projectID ||!stage){
      return sendResponse({
        message:"ProjectId and stage is required",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }

    const WbsActivityByStage= await prisma.wBSActivity.findMany({
      where:{
        projectID:projectID,
        stage:stage,
        type:type.toUpperCase()
      },
      include:{subTasks},
      orderBy:{
        createdAt:'asc'
      }
    })

    return sendResponse({
      message:"WBS activities fetched by the stage",
      res,
      statusCode:200,
      success:true,
      data:WbsActivityByStage
    })

  } catch (error) {
    console.error(error.message)
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    })
  }
}

const getWbsActivity = async (req, res) => {
  const { type, projectId, stage } = req.params;
  console.log(type);
  console.log(projectId);
  console.log(stage);

  try {
    const wbsActivity = await prisma.wBSActivity.findMany({
      where: {
        type: type.toUpperCase(),
        projectId: projectId,
        stage: stage
      },
      include: {
        subTasks: true
      }
    });

    const wbsActivityWithSum = await Promise.all(
      wbsActivity.map(async (activity) => {
        const subTasksSum = await prisma.subTasks.aggregate({
          where: {
            wbsactivityID: activity.id,
            projectID: projectId,
            stage: stage
          },
          _sum: {
            QtyNo: true,
            execHr: true,
            checkHr: true
          }
        });

        const project = await prisma.project.findUnique({
          where: {
            id: projectId
          },
          select: {
            estimatedHours: true
          }
        });
    const estimatedMins = project.estimatedHours * 60;
console.log("Estimated Minutes:", estimatedMins);

   const execHr = subTasksSum._sum.execHr || 0;
  const checkHr = subTasksSum._sum.checkHr || 0;
// console.log("Exec Hours:", execHr);
// console.log("Check Hours:", checkHr);

const gethours=await prisma.wBSActivity.aggregate({
      where:{
        projectId:projectId,
        stage:stage
      },
      _sum:{
        totalExecHr:true,
        totalCheckHr:true,
        totalCheckHrWithRework:true,
        totalExecHrWithRework:true
      }
    })
const totalSubTaskHours = gethours._sum.totalExecHr + gethours._sum.totalCheckHr;
console.log("Total SubTask Hours:", totalSubTaskHours);

const reworkPercentage = estimatedMins
  ? ((estimatedMins - totalSubTaskHours) / estimatedMins) * 100
  : 0;
console.log("Rework Percentage:", reworkPercentage);

const reworkPercentPerLineItems = reworkPercentage / 63;
console.log("Rework Percent Per Line Item:", reworkPercentPerLineItems);

const totalExecHrWithRework = execHr * reworkPercentPerLineItems;
const totalCheckHrWithRework = checkHr * reworkPercentPerLineItems;
console.log("Total ExecHr With Rework:", totalExecHrWithRework);
console.log("Total CheckHr With Rework:", totalCheckHrWithRework);



        await prisma.wBSActivity.update({
          where: {
            id: activity.id,
            projectId: projectId,
            stage: stage
          },
          data: {
            totalQtyNo: subTasksSum._sum.QtyNo || 0,
            totalExecHr: execHr,
            totalCheckHr: checkHr,
            totalExecHrWithRework,
            totalCheckHrWithRework
          }
        });

        return {
          id: activity.id,
          name: activity.name,
          totalQtyNo: subTasksSum._sum.QtyNo || 0,
          totalExecHr: execHr,
          totalCheckHr: checkHr,
          subTasks: activity.subTasks || [],
          reworkPercentage,
          reworkPercentPerLineItems,
          totalExecHrWithRework,
          totalCheckHrWithRework
        };
      })
    );

    return sendResponse({
      message: "WbsActivity found",
      res,
      statusCode: 200,
      success: true,
      data: wbsActivityWithSum,
    });
  } catch (error) {
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const getAcivity = async (req, res) => {
  const activity = await prisma.wBSActivity.findMany();

  return sendResponse({
    message: "Success",
    res,
    statusCode: 200,
    success: true,
    data: activity,
  });
};

const getTotalHours=async(req,res)=>{
  const{projectId,type,stage}=req.params
  try {
    if(!projectId||!type||!stage){
      return sendResponse({
        message:"type,projectId,stage values are requires",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }

    const wbsTotalHours= await prisma.wBSActivity.aggregate({
      where:{
        projectId:projectId,
        type:type,
        stage:stage
      },
      _sum:{
        totalQtyNo:true,
        totalCheckHr:true,
        totalExecHr:true,
        totalExecHrWithRework:true,
        totalCheckHrWithRework:true,
      }
    })
    return sendResponse({
      message:"TotalHours fetched succesfully",
      res,
      statusCode:200,
      success:true,
      data:wbsTotalHours
    })
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
}
const createNewWBSActivity=async(req,res)=>{
try {
  const{projectId}=req.params
  const{name,type,stage}=req.body

  if(!projectId||!name||!type||!stage){
    return sendResponse({
      message:"Feilds are Required",
      res,
      statusCode:200,
      success:false,
      data:null
    })
  }
  const newWbsActivity= await prisma.wBSActivity.create({
    data:{
      name:name,
      stage:stage,
      type:type,
      project:{
        connect:{id:projectId}
      }
    }
  })
  return sendResponse({
    message:"wbs rework added",
    res,
    statusCode:200,
    success:true,
    data:newWbsActivity
  })
} catch (error) {
   // console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
}
}

const getTotalWBSHours=async(req,res)=>{
  const{projectId,stage}=req.params
  try {
    if(!projectId||!stage){
      return sendResponse({
        message:"projectId and stage is required",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }
    const gethours=await prisma.wBSActivity.aggregate({
      where:{
        projectId:projectId,
        stage:stage
      },
      _sum:{
        totalExecHr:true,
        totalCheckHr:true,
        totalCheckHrWithRework:true,
        totalExecHrWithRework:true
      }
    })
    return sendResponse({
      message:"Total WBS working hours",
      res,
      statusCode:200,
      success:true,
      data:gethours
    })
  } catch (error) {
    console.log(error.message)
    return sendResponse({
    message:error.message,
    res,
    statusCode:500,
    success:false,
    data:null     
    })
  }
}


export { getWbsActivity, getAcivity,getWbsActivityByStage,getTotalHours,createNewWBSActivity,getTotalWBSHours};
