import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
    assignEstimationTask,
    estimationTaskReview,
    getAllEstimationTasks,
    getEstimationTaskById,
    updateTask,
    deletetask,
    getMyTasks
} from '../../controllers/estimationTask.js'

import {acknowledgeEst,addEstComment} from '../../controllers/comment.js'

const router = Router()

router.post("/assignTask/:estimationId/task",Authenticate,assignEstimationTask)
router.patch("/reviewTask/:estimationTaskId",Authenticate,estimationTaskReview)

router.get("/getAllTasks",Authenticate,getAllEstimationTasks)
router.get("/getMyTasks",Authenticate,getMyTasks)
router.get("/task/:estimationTaskId",Authenticate,getEstimationTaskById)

router.put("updateTask/:estimationTaskId",Authenticate,updateTask)
router.delete("/deleteTask/:estimationTaskId",Authenticate,deletetask)


router.post("/addComment/:estimationTaskId",Authenticate,addEstComment)
router.patch("/tasks/acknowledge/:commentId",Authenticate,acknowledgeEst)

export {router as EstimationTask}