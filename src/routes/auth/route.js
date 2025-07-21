import { Router } from "express";
import {
  login,
  resetpassword,
  signup,
  getuserbytoken,
  GetAllManager,
  disableUser
} from "../../controllers/auth.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";

import { exportcvs } from "../../controllers/exportcsv.js";

const router = Router();


router.post("/login", login); // Routing to Login Logic

router.post("/signup",signup); // Routing to SignUp (New User) Logic

router.post("/resetpassword", Authenticate, resetpassword); // Routing to Reset Password Logic

router.post("/getuserbytoken", Authenticate, getuserbytoken); // Routing to Get User Token Using accessToken (Verify and Extract (JWT))

router.get("/getallmanagers", Authenticate, isAdmin, GetAllManager); // Getting all managers

router.get("/exports/:model",Authenticate,exportcvs)

router.patch("/disable/:userId",Authenticate,disableUser)//disable the user access/login

export default router;
