import { Router } from "express";
import {
  login,
  resetpassword,
  signup,
  getuserbytoken,
  GetAllManager,
} from "../../controllers/auth.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/login", login); // Routing to Login Logic

router.post("/signup", Authenticate, isAdmin, signup); // Routing to SignUp (New User) Logic

router.post("/resetpassword", Authenticate, resetpassword); // Routing to Reset Password Logic

router.post("/getuserbytoken", Authenticate, getuserbytoken); // Routing to Get User Token Using accessToken (Verify and Extract (JWT))

router.get("/getallmanagers", Authenticate, isAdmin, GetAllManager); // Getting all managers

export default router;
