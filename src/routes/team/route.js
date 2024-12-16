import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import { AddTeam, GetIndiviualTeamMembers, GetTeam, GetTeamMembers, DeleteTeam } from "../../controllers/team.js";

const router = Router();

router.post('/teams', Authenticate, BroadAccess, AddTeam)
router.get("/teams/:teamid/members/:id", Authenticate, BroadAccess, GetIndiviualTeamMembers);
router.get("/teams/:tid", Authenticate, BroadAccess, GetTeam)
router.get("/teams/members/:id", Authenticate, BroadAccess, GetTeamMembers)
router.delete("/teams/:id/delete", Authenticate, BroadAccess, DeleteTeam)

export default router;