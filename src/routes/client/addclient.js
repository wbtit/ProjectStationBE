import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../utils/crypter.js";
import { getUserByUsername } from "../../models/userUniModel.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/:fid", Authenticate, isAdmin, async (req, res) => {
  console.log("Hello")
  const { fid } = req.params;
  console.log(fid)
  const {
    username,
    password,
    email,
    f_name,
    m_name,
    l_name,
    phone,
    landline,
    alt_landline,
    alt_phone,
    designation,
    address,
    fabricator,
  } = req.body;

  if (
    !username ||
    !password ||
    !f_name ||
    !phone ||
    !designation ||
    !address ||
    !fabricator
  ) {
    return sendResponse({
      message: "Fields are empty.",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!fabricator) {
    return sendResponse({
      message: "Invalid Fabricator",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const { headquaters } = fabricator;
  const { city, state, country, zip_code } = headquaters;

  const hashedPassword = await hashPassword(password);

  try {

    const isExist = await getUserByUsername(username);

    // If user exists on that username then return the response.
    if (isExist)
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });

    const newclient = await prisma.users.create({
      data: {
        username: username, 
        role : "CLIENT",
        password: hashedPassword,
        address: address,
        designation: designation,
        f_name: f_name,
        phone: phone,
        fabricatorId: fid, 
        alt_landline: alt_landline, 
        alt_phone: alt_phone, 
        email: email, 
        l_name: l_name, 
        landline: landline ,
        m_name: m_name,
        city: city,
        country: country,
        state: state,
        zip_code: zip_code,
      },
    });

    return sendResponse({
      message: "Client Added Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: newclient,
    });
  } catch (error) {
    console.log(error.message);
    sendResponse({
      message: "Something went wrong!!",
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