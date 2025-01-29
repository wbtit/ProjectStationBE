import { Router } from "express";
import { changeorderUploads } from "../../config/multer.js";
import { AddChangeOrder } from "../../controllers/changeorder.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post(
  "/co",
  Authenticate,
  changeorderUploads.array("files"),
  AddChangeOrder
);

export { router as ChangeOrderRouter };
