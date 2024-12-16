// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { getUserByID } from "../models/userUniModelByID.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import { areUsers } from "../models/areUsers.js";

const isMember = ({ members, id }) => {

  for (let member of members) {
    if (member.id === id) {
      return true; // Exit early if member is found
    }
  }

  return false; // Return false if no member was found
};

const AddTeam = async (req, res) => {

  const { name, manager, teammembers } = req.body;

  if (!name || !manager || !teammembers) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const isManager = await getUserByID({ id: manager });

    if (!isManager) {
      return sendResponse({
        message: "Invalid Manager",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const { is_active, is_staff } = isManager;

    if (!is_active || !is_staff) {
      return sendResponse({
        message: "Person assigned is not a manager",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const teams = await prisma.team.create({
      data: {
        name: name,
        managerID: manager,
        members: teammembers,
      },
    });

    return sendResponse({
      message: "Team Created Successfully!",
      res,
      statusCode: 200,
      success: true,
      data: teams,
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

const GetTeam = async (req, res) => {

  const { tid } = req.params;

  if (!tid) {

    return sendResponse({
      message: "Team ID not found",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!isValidUUID(tid)) {

    return sendResponse({
      message: "Invalid Team UUID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const teams = await prisma.team.findUnique({
      where: {
        id: tid,
      },
    });

    if (!teams) {

      return sendResponse({
        message: "Invalid team ID",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const { foundUsers, missingUsers } = await areUsers({
      users: teams.members,
    });

    const newTeams = { ...teams, members: foundUsers };

    return sendResponse({
      message: "Team Data fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: { data: newTeams, missingUsers },
    });
  } catch (error) {

    return sendResponse({
      message: "Somethings went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
};

const GetTeamMembers = async (req, res) => {

  const { id } = req.params;

  try {
    const team = await prisma.team.findUnique({ 
      where: {
        id,
      },
    });

    if (!team) {

      return sendResponse({
        message: "Team not found",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    let members = team.members;
    const { foundUsers, missingUsers } = await areUsers({ users: members });

    return sendResponse({
      message: "Team members fetche successfully",
      res,
      statusCode: 200,
      success: true,
      data: foundUsers,
    });
  } catch (error) {

    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
};

const GetIndiviualTeamMembers = async (req, res) => { 

  const { teamid, id } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: {
        id: teamid,
      },
    });

    if (!team) {
      return sendResponse({
        message: "Cannot find the team",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    if (isMember({ id: id, members: team.members })) {  // This is to ensure that this id is in th members array to verify that he belong to this team or not and i will return members with there compplete data
      const user = await getUserByID({ id: id });
      if (!user) {
        return sendResponse({
          message: "Cannot fetch user",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
      return sendResponse({
        message: "Member fetched successfully",
        res,
        statusCode: 200,
        success: true,
        data: user,
      });
    } else {
      return sendResponse({
        message: "Member is not in this team",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
};

const DeleteTeam = async (req, res) => {

  const { id } = req.params;

  if (!id) {  // Checking if the Team ID is not undefined
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const response = await prisma.team.delete({
      where: {
        id,
      },
    });
    return sendResponse({
      message: "Team Deletion Success",
      res,
      statusCode: 200,
      success: true,
      data: response,
    });
  } catch (error) {

    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const RemoveMember = async (req, res) => {
  const { id, mid, role } = req.params;

  if (!id || !mid || !role) // Checking that all the necessary fields are not undefined
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  try {
    const { members } = await prisma.team.findUnique({  // Select only members array using the Team ID
      where: {
        id,
      },
      select: {
        members: true,
      },
    });

    if (!members) {
      return sendResponse({
        message: "Cannot find team",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const newMembers = members.filter(  // Removing that particular member from the array and update it
      (mem) => mem.id !== mid && mem.role !== role
    );

    const newTeam = await prisma.team.update({
      where: {
        id,
      },
      data: {
        members: newMembers,
      },
    });

    return sendResponse({
      message: "Member removed successfully",
      res,
      statusCode: 200,
      success: true,
      data: newTeam,
    });
  } catch (error) {

    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 200,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const AddMember = async (req, res) => {
  const { tid } = req.params;
  const { id, role } = req.body;

  if (!tid || !id || !role) {  // Checking if the necessary data are not undefined.
    return sendResponse({
      message: "Incomplete data",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const { members } = await prisma.team.findUnique({ // Selecting only members using th Team ID
      where: {
        id: tid,
      },
      select: {
        members: true,
      },
    });

    if (!members) { // If members is undefined then it's a invalid Team. (If it's valid one we will get '[]')
      return sendResponse({
        message: "Invalid Team ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    members.push({ // Push the new member to the array and update
      id: id,
      role: role,
    });

    const newTeam = await prisma.team.update({
      where: {
        id: tid,
      },
      data: {
        members,
      },
    });

    return sendResponse({
      message: "Member added successfully",
      res,
      statusCode: 200,
      success: true,
      data: newTeam,
    });
  } catch (error) {

    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const GetAllTeams = async (req, res) => {
  try {
    const Teams = await prisma.team.findMany(); // Getting all the teams irrespective of any conditions.

    return sendResponse({
      message: "Retrived All Teams",
      res,
      statusCode: 200,
      success: true,
      data: Teams,
    });
  } catch (error) {
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const UpdateTeam = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    // Checking if the team ID is valid or not
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (req.manager_id) {
    // Checking that we are updating manager or not

    // If yes.

    const { is_manager } = await prisma.users.findUnique({
      where: {
        id: req.manager_id,
      },
      select: {
        is_manager: true,
      },
    });

    if (!is_manager) {
      // Check he is a manager or not
      return sendResponse({
        message: "Selected Person is not a Manager",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
  }

  const { members, ...updatableData } = req.body; // We are not updating the members here, therefore removing the members if exists.

  try {
    const updatedTeam = await prisma.team.update({
      // Updaing Team
      where: {
        id,
      },
      data: updatableData,
    });

    return sendResponse({
      message: "Team Updated Successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export {
  AddTeam,
  GetIndiviualTeamMembers,
  GetTeam,
  GetTeamMembers,
  DeleteTeam,
  RemoveMember,
  AddMember,
  GetAllTeams,
  UpdateTeam,
};
