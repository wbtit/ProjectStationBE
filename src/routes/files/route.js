import  uploads  from "../../middlewares/upload.js";
import Router from "express"
import Authenticate from "../../middlewares/authenticate.js";
import {downloadFile,fileUpload,viewFile} from "../../controllers/files.js"

const router=Router()

router.post("/uploads",Authenticate,uploads.array("files"),fileUpload)
router.get("/view/:fileId",Authenticate,viewFile)
router.get("/download/:fileId",Authenticate,downloadFile)

export default router;