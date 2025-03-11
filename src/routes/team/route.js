import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import {
  AddTeam,
  GetIndiviualTeamMembers,
  GetTeam,
  GetTeamMembers,
  DeleteTeam,
  RemoveMember,
  AddMember,
  GetAllTeams,
  UpdateTeam,
} from "../../controllers/team.js";
import { isStaff } from "../../middlewares/isstaff.js";

const router = Router();

router.post("/teams", Authenticate, BroadAccess, AddTeam); // Adding Team

router.get(
  "/teams/:teamid/members/:id",
  Authenticate,
  isStaff,
  GetIndiviualTeamMembers
); // Get Indiviual Team Member Details

router.get("/teams/:tid", Authenticate, isStaff, GetTeam); // Getting Indiviual Team

router.get("/teams/members/:id", Authenticate, isStaff, GetTeamMembers); // Geting All Team Memberd from a Team

router.delete("/teams/:id/delete", Authenticate, BroadAccess, DeleteTeam); // Delete a Team

router.patch(
  "/teams/:id/remove_member/:mid/role/:role",
  Authenticate,
  BroadAccess,
  RemoveMember
); // Remove Team Member from a Team

router.patch("/teams/:tid/addmember", Authenticate, BroadAccess, AddMember); // Adding a member to a Team

router.get("/teams", Authenticate, isStaff, GetAllTeams); // To Get All Teams

router.patch("/teams/:id", Authenticate, BroadAccess, UpdateTeam); // Update Team Deatails Except Team Members (Team Member Operations Are Done Using Different Routes)

export default router;
