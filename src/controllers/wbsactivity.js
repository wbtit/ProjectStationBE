import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getWbsActivity = async (req, res) => {
  const { type,projectID} = req.params;

  try {
    const wbsActivity = await prisma.wBSActivity.findMany({
      where: {
        type: type.toUpperCase(),
      },
    });

    const wbsActivityWithSum= await Promise.all(
      wbsActivity.map(async(activity)=>{
        const subTasksSum= await prisma.subTasks.aggregate({
          where:{wbsactivityID:activity.id, 
              ...(projectID && { projectID }),
        },
          _sum:{
            QtyNo:true,
            execHr:true,
            checkHr:true
          }
        })
        return {
          id:activity.id,
          name:activity.name,
          totalQtyNo:subTasksSum._sum.QtyNo || 0,
          totalExecHr:subTasksSum._sum.execHr || 0.0,
          totalCheckHr:subTasksSum._sum.checkHr ||0.0,
          
        }
      })
    )
    console.log("The wbsActivityWithSum000000000000000000000000000",wbsActivityWithSum)

    return sendResponse({
      message: "WbsActivity found",
      res,
      statusCode: 200,
      success: true,
      data: wbsActivityWithSum,
    });
  } catch (error) {
    console.log(error.message);
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

export { getWbsActivity, getAcivity };
