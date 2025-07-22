import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
End, Pause, Resume, Start,getWork
} from "../../controllers/estimationWorkingHours.js"



const   router = Router()

router.post("/ewh/start",Authenticate,Start)
router.patch("/ewh/pause",Authenticate,Pause)
router.patch("/ewh/resume",Authenticate,Resume)
router.patch("/ewh/end",Authenticate,End)
router.get("/ewh/:estimationTaskId", Authenticate, getWork);


export { router as estimationWH}