
import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addSubTask=async(req,res)=>{
  const{projectID,wbsactivityID}=req?.params
  const{description,unitTime,CheckUnitTime}=req.body
  // console.log(req.body)

try{  if(!description ||!unitTime||!CheckUnitTime){
    return sendResponse({
      message:"Feilds are Empty while adding subtask",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }

  const subTask= await prisma.subTasks.create({
    data:{
      description:description,
      unitTime:unitTime,
      CheckUnitTime:CheckUnitTime,
      projectID:projectID,
      wbsactivityID:wbsactivityID
    }
  })
    if(!subTask){
      return sendResponse({
        message:"Failed to create Subtask",
        res,
        statusCode:400,
        success:false,
        data:null,
      })
       
    }
  return sendResponse({
      message:"sunTask added successfully",
      res,
      statusCode:200,
      success:true,
      data:subTask,
    })
  }catch(error){
    console.error("Error adding subtask:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }

}

const addSubTasks = async (req, res) => {
  const { projectID, wbsactivityID } = req.params;
  // console.log("Subtasks:", req.body);

  if (!req.body || req.body.length === 0) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtask = await Promise.all(
      Object.values(req.body).map((task) =>
        prisma.subTasks.upsert({
          where: { id: task.id || "" }, // Ensuring ID is provided
          update: {
            description: task.description,
            QtyNo: parseInt(task.QtyNo) || 0, // Default to 0 if missing
            execHr: parseFloat(task.execHr) || 0.0, // Default to 0.0 if missing
            checkHr: parseFloat(task.checkHr) || 0.0, // Default to 0.0 if missing
          },
          create: {
            description: task.description,
            QtyNo: parseInt(task.QtyNo) || 0,
            execHr: parseFloat(task.execHr) || 0.0,
            checkHr: parseFloat(task.checkHr) || 0.0,
            projectID:projectID,
            wbsactivityID:wbsactivityID
          },
        })
      )
    );

    return sendResponse({
      message: "Subtask added successfully",
      res,
      statusCode: 200,
      success: true,
      data: subtask,
    });
  } catch (error) {
    console.error("Error adding subtasks:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};




const GetSubTasks = async (req, res) => {
  try {
    const { projectID, wbsactivityID } = req.params;

    const subtasks = await prisma.subTasks.findMany({
      where: {
        projectID,
        wbsactivityID,
      },
    });

    // console.log("The subTasks", subtasks)

    sendResponse({
      message: "Subtasks fetch success",
      res,
      statusCode: 200,
      success: true,
      data: subtasks,
    });
  } catch (error) {
    sendResponse({
      message: "Subtasks fetch failed",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const UpdateSubTasks = async (req, res) => {
  const { subtaskid } = req.params;
  console.log(subtaskid)

  if (!subtaskid) {
    sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtasks = await prisma.subTasks.update({
      where: {
        id: subtaskid,
      },
      data: req.body,
    });
    console.log(subtasks)
    sendResponse({
      message: "Subtasks update success",
      res,
      statusCode: 200,
      success: true,  
      data: subtasks,
    });
  } catch (error) {
    sendResponse({
      message: "Subtasks update failed",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export { GetSubTasks, UpdateSubTasks,addSubTasks,addSubTask};
