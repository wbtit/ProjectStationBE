import { Router } from "express";
import { changeorderUploads } from "../../config/multer.js";
import { AddChangeOrder,changeOrderReceived,changeOrderSent } from "../../controllers/changeorder.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post(
  "/addco",
  Authenticate,
  changeorderUploads.array("files"),
  AddChangeOrder
);

router.get("/receives",Authenticate,changeOrderReceived)
router.get("/sents",Authenticate,changeOrderSent)
export { router as ChangeOrderRouter };
