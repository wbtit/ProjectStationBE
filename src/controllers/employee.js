import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/crypter.js";
import { getUserByUsername } from "../models/userUniModel.js";

const AddEmployee = async (req, res) => {
  const {
    username,
    password,
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

  console.log(
    username,
    password,
    f_name,
    email,
    phone,
    emp_code,
    department,
    is_manager,
    is_sales
  );

  if (
    !username ||
    !password ||
    !f_name ||
    !email ||
    !phone ||
    !emp_code ||
    !department
  ) {
    return sendResponse({
      message: "Fields are empty.",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const hashedPassword = await hashPassword(password);

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

export { AddEmployee };
