import {Router} from 'express'
import Authenticate from '../../middlewares/authenticate.js'

import {
    createEstimation,
    getallEstimation,
    getEstimationById,
    updateEstimationData,
    deleteEstimationData,
    updateStatus}  from '../../controllers/estimationManagement.js'

    

const router = Router()

router.post("/addEstimation",Authenticate,createEstimation)
router.get("/getAllEstimations",Authenticate,getallEstimation)
router.get("/getEstimation/:estimationId",Authenticate,getEstimationById)
router.put("/updateEstimation/:estimationId",Authenticate,updateEstimationData)
router.delete("/deleteEstimation/:estimationId",Authenticate,deleteEstimationData)
router.patch("/updateStatus/:estimationId/:status",Authenticate,updateStatus)

export  {router as estimation};