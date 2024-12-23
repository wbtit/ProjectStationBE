// Please navigate to very bottom of the file to know the logics in this file.

import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/crypter.js";
import { getUserByUsername } from "../models/userUniModel.js";

const addClient = async (req, res) => {
  const { fid } = req.params;

  console.log(req.body);

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
    is_superuser,
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

  const fab = await prisma.fabricator.findUnique({
    where: {
      id: fabricator,
    },
  });

  if (!fab) {
    return sendResponse({
      message: "Cannot find fabricator",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  let city, state, country, zip_code;

  if (address === fab.headquaters.id) {
    city = fab.headquaters.city;
    state = fab.headquaters.state;
    country = fab.headquaters.country;
    zip_code = fab.headquaters.zip_code;
  } else {
    fab.branches.map((branch) => {
      if (branch.id === address) {
        city = branch.city;
        state = branch.state;
        country = branch.country;
        zip_code = branch.zip_code;
      }
    });
  }

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
        role: "CLIENT",
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
        landline: landline,
        m_name: m_name,
        city: city,
        country: country,
        state: state,
        zip_code: zip_code,
        is_superuser: is_superuser,
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

const updateClient = async (req, res) => {
  const { cid } = req.params;

  if (!cid) {
    return sendResponse({
      message: "Invalid Client",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!req.body) {
    return sendResponse({
      message: "Fields are empty!",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const updateclient = await prisma.client.update({
      where: {
        id: cid,
      },
      data: req.body,
    });

    return sendResponse({
      message: "Client Updated Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: updateclient,
    });
  } catch (error) {
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
};

const deleteClient = async (req, res) => {
  const { cid } = req?.params;
  if (!cid) {
    return sendResponse({
      message: "Failed to get clientId",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    const deleteClient = await prisma.client.delete({
      where: {
        id: cid,
      },
    });
    if (!deleteClient) {
      return sendResponse({
        message: "No client found with ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Client deleted Success",
      res,
      statusCode: 200,
      success: true,
      data: deleteClient,
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

const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        role: "CLIENT",
      },
    });
    if (!clients) {
      return sendResponse({
        message: "No clients found",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Clients Fetched Successfully",
      res,
      statusCode: 200,
      success: true,
      data: null,
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

export { addClient, updateClient, deleteClient, getAllClients };
