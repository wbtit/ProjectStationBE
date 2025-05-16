import  upload  from "../../middlewares/upload.js";
import Router from "express"
import Authenticate from "../../middlewares/authenticate.js";
import {downloadFile,fileUpload,viewFile} from "../../controllers/files.js"

const router=Router()

router.post("/uploads",Authenticate,upload.array("files"),fileUpload)
router.get("/view/:fileId",Authenticate,viewFile)
router.get("/download/:fileId",Authenticate,downloadFile)

 export {router as File}