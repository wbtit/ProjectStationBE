import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { getUserByID } from "../models/userUniModelByID.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import { areUsers } from "../models/areUsers.js";

const isMember = ({ members, id }) => {
  console.log(members, id);

  for (let member of members) {
    if (member.id === id) {
      return true; // Exit early if member is found
    }
  }

  return false; // Return false if no member was found
};

const AddTeam = async (req, res) => {
  console.log("Nigga 1");

  const { name, manager, teammembers } = req.body;

  if (!name || !manager || !teammembers) {
    console.log("Fields are empty!");
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
      console.log("Invalid Manager");
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
      console.log("Person assigned for manager is not a manager");
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
    console.log(error.message);
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
  console.log("Nigga 2");

  const { tid } = req.params;

  console.log(tid);

  if (!tid) {
    console.log("Team ID not found");
    return sendResponse({
      message: "Team ID not found",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!isValidUUID(tid)) {
    console.log("Invalid Team ID");
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
      console.log("Invalid Team ID");
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

    console.log(foundUsers);
    console.log(teams);

    return sendResponse({
      message: "Team Data fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: { data: newTeams, missingUsers },
    });
  } catch (error) {
    console.log(error.message);
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
  console.log("Nigga 3");

  const { id } = req.params;

  console.log(id);

  try {
    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    console.log(team);

    if (!team) {
      console.log("Team not found");
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

    console.log(foundUsers, missingUsers);

    return sendResponse({
      message: "Team members fetche successfully",
      res,
      statusCode: 200,
      success: true,
      data: foundUsers,
    });
  } catch (error) {
    console.log(error.message);
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
  console.log("Nigga 4");

  const { teamid, id } = req.params;

  console.log(teamid, id);

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

    console.log("Checker", isMember({ id: id, members: team.members }));

    if (isMember({ id: id, members: team.members })) {
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
  console.log("You ");

  const { id } = req.params;

  console.log(id);

  if (!id) {
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
    console.log(error.message);
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

  if (!id || !mid || !role)
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  try {
    const { members } = await prisma.team.findUnique({
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

    const newMembers = members.filter(
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
    console.log(error.message);
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
  console.log("Add Member");
  const { tid } = req.params;
  const { id, role } = req.body;
  console.log(tid, id, role);

  if (!tid || !id || !role) {
    return sendResponse({
      message: "Incomplete data",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const { members } = await prisma.team.findUnique({
      where: {
        id: tid,
      },
      select: {
        members: true,
      },
    });

    if (!members) {
      return sendResponse({
        message: "Invalid Team ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    members.push({
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
    console.log(error.message);
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
    const Teams = await prisma.team.findMany();

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
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (req.manager_id) {
    const { is_manager } = await prisma.users.findUnique({
      where: {
        id: req.manager_id,
      },
      select: {
        is_manager: true,
      },
    });

    if (!is_manager) {
      return sendResponse({
        message: "Selected Person is not a Manager",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
  }

  const { members, ...updatableData } = req.body;

  try {
    const updatedTeam = await prisma.team.update({
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