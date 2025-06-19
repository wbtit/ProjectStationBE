// Please navigate to very bottom of the file to know the logics in this file.

import { generateToken } from "../utils/jwtutils.js";
import { comparePassword, hashPassword } from "../utils/crypter.js";
import { getUserByUsername } from "../models/userUniModel.js";
import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const createUser = async ({
  username,
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
    const hashedPassword = await hashPassword("Qwerty!23456");
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

const login = async (req, res) => {
  let { username, password } = req.body;

  // console.log(username.length, password.length);

  if (!username || !password) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 401,
      success: false,
      data: null,
    });
  }

  try {
    // Find the user by username
    const user = await getUserByUsername(username);
    // console.log(username)
    if (!user) {
      return sendResponse({
        message: "user not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    // Compare the provided password with the stored hashed password
    password = typeof password === "number" ? password.toString() : password;
    // console.log("Password:",password)
    // console.log("userPassword:",user.password)
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return sendResponse({
        message: "Invalid password",
        res,
        statusCode: 401,
        success: false,
        data: null,
      });
    }

    const token = generateToken(user);

    return sendResponse({
      message: "Login Success",
      res,
      statusCode: 200,
      success: true,
      token: token,
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

const signup = async (req, res) => {
  const {
    username,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    role,
    is_active,
    is_superuser,
    is_firstLogin,
    emp_code,
    department,
    designation,
    manager,
    sales,
  } = req.body;

  if (!username || !f_name || !phone || !role) {
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
};

const resetpassword = async (req, res) => {
  const { old_password, new_password } = req.body;

  const { password, id } = req.user;

  if (!old_password || !new_password) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (await comparePassword(old_password, password)) {
    const newPassword = await hashPassword(new_password);

    const updatedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        is_firstLogin: false,
        password: newPassword,
      },
    });

    const token = generateToken(updatedUser);

    return sendResponse({
      message: "Password resetted successfully",
      res,
      statusCode: 200,
      success: true,
      data: token,
    });
  } else {
    return sendResponse({
      message: "Old Password is wrong",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
};

const getuserbytoken = (req, res) => {
  if (!req.user) {
    return sendResponse({
      message: "User not Authenticated.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  } else {
    return sendResponse({
      message: "User Fetched Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: req.user,
    });
  }
};

const GetAllManager = async (req, res) => {
  try {
    const managers = await prisma.users.findMany({
      where: {
        is_manager: true,
      },
    });

    return sendResponse({
      message: "Fetched all managers",
      res,
      statusCode: 200,
      success: true,
      data: managers,
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

const disableUser= async(req,res)=>{
  const {userId}=req.params
  if(!userId){
    return sendResponse({
      message:"UserId is required",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }
  try {
   const userDisabled= await prisma.users.update({
    where:{
      id:userId
    },
    data:{
      is_disabled:true
    }
   })
   return sendResponse({
    message:"userDisabled successfully",
    res,
    statusCode:200,
    success:true,
    data:userDisabled
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

export { login, signup, resetpassword, getuserbytoken, GetAllManager,disableUser};
