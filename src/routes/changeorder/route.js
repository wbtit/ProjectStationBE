import { Router } from "express";
import { changeorderUploads } from "../../config/multer.js";
import { AddChangeOrder,changeOrderReceived,changeOrderSent,addCoResponse,getResponse,AddChangeOrdertable,getRowCotable,viewCOfiles} from "../../controllers/changeorder.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post(
  "/addco",
  Authenticate,
  changeorderUploads.array("files"),
  AddChangeOrder
);

router.get("/viewfile/:id/:fid", viewCOfiles);

router.get("/receives",Authenticate,changeOrderReceived)
router.get("/sents",Authenticate,changeOrderSent)
router.post("/addResponse/:coId",Authenticate,addCoResponse)
router.get("/getresponse/:id",Authenticate,getResponse)

router.post("/coTable/:coId",Authenticate,AddChangeOrdertable)
router.get("/coRow/:CoId",Authenticate,getRowCotable)
    
export { router as ChangeOrderRouter };
