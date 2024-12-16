import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const addTaskAssignedList=async(req,res)=>{
    const {
        approved_on,
        assigned_on,
        approved,
        comment,
        task_id,
        assigned_by,
        assigned_to,
        approved_by
    }=req.body


    if(!approved_on||
        !assigned_on||
        !approved||
        !comment||
        !task_id||
        !assigned_by||
        !assigned_to||
        !approved_by
    ){
        return sendResponse ({
            message:"Fields are Empty!",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    try{
        const newTaskAssignedList=await prisma.assigned_list.create({
            data:{
                approved_on,
        assigned_on,
        approved,
        comment,
        task_id,
        assigned_by,
        assigned_to,
        approved_by
            }
        })

        return sendResponse ({
            message:"Task Added to AssignedList Successfully",
            res,
            statusCode:200,
            data:newTaskAssignedList
        })
    }catch(error){
        return sendResponse ({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }finally{
        prisma.$disconnect();
    }
};

const GetTaskByIDAssignedList = async (req, res) => {

    const { id } = req?.params;
  
 
    try {
      if (!req.user) {
  
        return sendResponse({
          message: "User not authenticated",
          res,
          statusCode: 403,
          success: false,
          data: null,
        });
      }
  
      if (!id) {
        return sendResponse({
          message: "Invalid task ID",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
  
     
  
      if (!isValidUUID(id)) {
        return sendResponse({
          message: "Invalid task UUid",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
  
      const task = await prisma.assigned_list.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        
        return sendResponse({
          message: "error in fetching task by id",
          res,
          statusCode: 403,
          success: false,
          data: null,
        });
      }
      return sendResponse({
        message: "Task by id fetched successfully",
        res,
        statusCode: 200,
        success: true,
        data: task,
      });
    } catch (error) {
     
      return sendResponse({
        message: "Error in fetching task by id",
        res,
        statusCode: 500,
      });
    } finally {
      prisma.$disconnect();
    }
  };

const updateTaskAssignesById=async(req,res)=>{
 const {id} =req?.params

 try{
    if (!isValidUUID(id)) {
        return sendResponse({
          message: "Invalid task UUid",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }

    const task=await prisma.assigned_list.update({
        where:{id},
        data:req.body
    })
    if(!task){
        return sendResponse({
            message: "error in updating task by id",
            res,
            statusCode: 403,
            success: false,
            data: null,
          });
    }
    return sendResponse({
        message: "TaskbyID updated successfully",
        res,
        statusCode: 200,
        success: true,
        data: task,
      });
 }catch(error){
    return sendResponse({
        message: "Error in fetching tasks",
        res,
        statusCode: 500,
      });
 }finally{
    prisma.$disconnect()
 }
}

  export{
    GetTaskByIDAssignedList,
    addTaskAssignedList,
    updateTaskAssignesById
  }