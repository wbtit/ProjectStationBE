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
  const { type,projectId,stage} = req.params;
  console.log(type)
  console.log(projectId)+
  console.log(stage)

  try {
    const wbsActivity = await prisma.wBSActivity.findMany({
      where: {
        type: type.toUpperCase(),
        projectId:projectId,
        stage:stage
      },include:{
        subTasks:true
      }
    });

    const wbsActivityWithSum = await Promise.all(
  wbsActivity.map(async (activity) => {
    const subTasksSum = await prisma.subTasks.aggregate({
      where: {
        wbsactivityID: activity.id,
        projectID: projectId, // Ensure projectID is explicitly used
        stage: stage,         // --- IMPORTANT: Filter by stage here ---
      },
      _sum: {
        QtyNo: true,
        execHr: true,
        checkHr: true
      }
    });
    await prisma.wBSActivity.update({
      where:{
          id: activity.id,
          projectId: projectId, // Ensure projectID is explicitly used
          stage: stage,  
      },
      data:{
        totalQtyNo:subTasksSum._sum.QtyNo,
        totalExecHr:subTasksSum._sum.execHr,
        totalCheckHr:subTasksSum._sum.checkHr
      }
    })
    return {
      id: activity.id,
      name: activity.name,
      totalQtyNo: subTasksSum._sum.QtyNo || 0,
      totalExecHr: subTasksSum._sum.execHr || 0.0,
      totalCheckHr: subTasksSum._sum.checkHr || 0.0,
      subTasks: activity.subTasks || [],
    };
  })
);
    // console.log("The wbsActivityWithSum000000000000000000000000000",wbsActivityWithSum)

    return sendResponse({
      message: "WbsActivity found",
      res,
      statusCode: 200,
      success: true,
      data: wbsActivityWithSum,
    });
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

export { getWbsActivity, getAcivity,getWbsActivityByStage};
