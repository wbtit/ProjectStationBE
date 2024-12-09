import { hashPassword } from "../../utils/crypter.js"; // For hashing the password
import prisma from "../../lib/prisma.js";
import { Router } from "express";
import { getUserByUsername } from "../../models/userUniModel.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

// User service for creating user
const createUser = async ({
  username,
  password,
  email,
  f_name,
  m_name,
  l_name,
  phone,
  role,
  is_active,
  is_staff,
  is_superuser,
  is_firstLogin,
  emp_code,
  department,
  designation,
  is_sales,
}) => {
  try {
    // Hash the password before storing
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    // Create user in the database
    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
        f_name,
        m_name,
        l_name,
        phone,
        role,
        is_active,
        is_staff,
        is_superuser,
        is_firstLogin,
        emp_code,
        department,
        designation,
        is_sales,
      },
    });
    return newUser;
  } catch (error) {
    return "Error creating user: " + error.message;
  } finally {
    prisma.$disconnect();
  }
};

// User route to handle user creation
router.post("/", async (req, res) => {
  console.log("Hello", req.body);

  const {
    username,
    password,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    role,
    is_active,
    is_staff,
    is_superuser,
    is_firstLogin,
    emp_code,
    department,
    designation,
    manager,
    sales,
  } = req.body;

  console.log(
    username,
    password,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    role,
    is_active,
    is_staff,
    is_superuser,
    is_firstLogin,
    department,
    designation,
    manager,
    sales,
    emp_code
  );

  if (!username || !password || !f_name || !phone || !role) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    // Check whether the username is available or not.

    const isExist = await getUserByUsername(username);

    // If user exists on that username then return the response.
    if (isExist)
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });

    const is_staff = manager ? true : false;
    const is_sales = sales ? true : false;

    const newUser = await createUser({
      username,
      password,
      email,
      f_name,
      m_name,
      l_name,
      phone,
      role,
      is_active,
      is_staff,
      is_superuser,
      is_firstLogin,
      emp_code,
      department,
      designation,
      is_sales,
    });

    // Respond with the created user data
    return sendResponse({
      message: "User created successfully",
      res,
      statusCode: 200,
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
});

export default router;
