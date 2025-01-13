import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfiUploads } from "../../config/multer.js";

import { addRFI } from "../../controllers/rfi.js";

const router= Router()

router.post("rfi/addrfi",Authenticate,rfiUploads.array('files'),addRFI)

export default router