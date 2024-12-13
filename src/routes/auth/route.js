import { Router } from "express";
import {
  login,
  resetpassword,
  signup,
  getuserbytoken,
} from "../../controllers/auth.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/login", login);
router.post("/signup", Authenticate, isAdmin, signup);
router.post("/resetpassword", Authenticate, resetpassword);
router.post("/getuserbytoken", Authenticate, getuserbytoken);

export default router;
