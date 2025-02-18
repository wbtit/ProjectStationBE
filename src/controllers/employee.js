import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/crypter.js";
import { getUserByUsername } from "../models/userUniModel.js";

const AddEmployee = async (req, res) => {
  const {
    username,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    is_sales,
    emp_code,
    department,
    is_manager,
  } = req.body;

  console.log(req.body);

  if (!username || !f_name || !email || !phone || !emp_code) {
    return sendResponse({
      message: "Fields are empty.",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const hashedPassword = await hashPassword("Qwerty!23456");

  try {
    const isExist = await getUserByUsername(username);

    // If user exists on that username then return the response.
    if (isExist)
      return sendResponse({
        message: "Username already taken",
        res,
        statusCode: 409,
        success: false,
        data: null,
      });

    const newEmployee = await prisma.users.create({
      data: {
        username,
        f_name,
        password: hashedPassword,
        phone,
        role: "STAFF",
        is_manager,
        is_sales,
        m_name,
        l_name,
        department,
        emp_code,
        email,
        is_staff: true,
      },
    });

    return sendResponse({
      message: "Employee Added Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: newEmployee,
    });
  } catch (error) {
    sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.users.findMany({
      where: {
        role: "STAFF",
      },
    });
    console.log(employees);
    if (!employees) {
      return sendResponse({
        message: "No employee found",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Employees Fetched Successfully",
      res,
      statusCode: 200,
      success: true,
      data: employees,
    });
  } catch (error) {
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
};

const GetEmployeeBYID = async (req, res) => {
  const { eid } = req.params;

  if (!isValidUUID(eid)) {
    return sendResponse({
      message: "Invalid client ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const employee = await prisma.users.findUnique({
      where: {
        id: eid,
      },
    });

    if (!employee) {
      return sendResponse({
        message: "No employee found",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    console.log(employee);

    return sendResponse({
      message: "Employee fetch success",
      res,
      statusCode: 200,
      success: true,
      data: employee,
    });
  } catch (error) {
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
};

const UpdateEmployee = async(req, res) => {

  const {id} = req.user

  if(!id) {
    return sendResponse({
      message : "Cannot find user",
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

  const updatedEmployee = await prisma.users.update({
    where : {
      id
    },
    data : req.body
  })

  return sendResponse({
    message : "User updated success",
    res,
    statusCode : 200,
  success : true,
  data : updatedEmployee
  })

}

export { AddEmployee, GetEmployeeBYID, getAllEmployees, UpdateEmployee };
