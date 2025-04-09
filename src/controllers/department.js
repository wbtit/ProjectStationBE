// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { getUserByID } from "../models/userUniModelByID.js";
import { getDepartments } from "../models/getAllDepartments.js";

const AddDepartment = async (req, res) => {
  const { id } = req.user;

  const { name, manager } = req.body;

  // console.log(req.body);

  if (!name || !manager)
    return sendResponse({
      message: "Incomplete credentials.",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  const user = await getUserByID({ id: manager });

  if (!user)
    return sendResponse({
      message: "Invalid Manager ID.",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  const { is_active, is_staff, is_manager, username } = user;

  if (is_manager) {
    try {
      const department = await prisma.department.create({
        data: {
          name,
          createdById: id,
          managerId: manager,
        },
      });
      return sendResponse({
        message: "Department created successfully.",
        res,
        statusCode: 200,
        success: true,
        data: department,
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
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return sendResponse({
      message: `${username} is not a manager.`,
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
};

const GetDepartment = async (req, res) => {
  try {
    const departments = await getDepartments();
    return sendResponse({
      message: "Department fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: departments,
    });
  } catch (error) {
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const updateDepartment=async(req,res)=>{
 const{id}=req?.params
 if(!id) {
  return sendResponse({
    message : "Cannot find Department",
    res,
    statusCode : 400,
    success : false,
    data : null
  })
}

if(!req.body) {
  return sendResponse({
    message : "Invalid Data",
    res ,
    statusCode : 400,
    success : false,
    data : null
  })
}

const updatedEmployee = await prisma.department.update({
  where : {
    id
  },
  data : req.body
})

return sendResponse({
  message : "Department updated success",
  res,
  statusCode : 200,
success : true,
data : updatedEmployee
})
}

export { AddDepartment, GetDepartment ,updateDepartment};
