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

const router = Router()

router.post("/assignTask/:estimationId/task",Authenticate,assignEstimationTask)
router.patch("/reviewTask/:estimationTaskId",Authenticate,estimationTaskReview)
router.get("/getAllTasks",Authenticate,getAllEstimationTasks)
router.get("/getMyTasks",Authenticate,getMyTasks)
router.get("/task/:estimationTaskId",Authenticate,getEstimationTaskById)
router.put("updateTask/:estimationTaskId",Authenticate,updateTask)
router.delete("/deleteTask/:estimationTaskId",Authenticate,deletetask)

export {router as EstimationTask}