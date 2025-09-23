import {Router} from 'express'
import Authenticate from '../../middlewares/authenticate.js'

import {
    createEstimation,
    getallEstimation,
    getEstimationById,
    updateEstimationData,
    deleteEstimationData,
    updateStatus,
    setFinalPrice,
    estimationsViewFiles,
    updateEstimationLineItem,
    createLineItem
    }  from '../../controllers/estimationManagement.js'

    import { estimationUploads } from '../../config/multer.js'

const router = Router()

router.post("/addEstimation",Authenticate,estimationUploads.array("files"),createEstimation)

router.get("/getAllEstimations",Authenticate,getallEstimation)
router.get("/getEstimation/:estimationId",Authenticate,getEstimationById)

router.put("/updateEstimation/:estimationId",Authenticate,updateEstimationData)
router.delete("/deleteEstimation/:estimationId",Authenticate,deleteEstimationData)
router.patch("/updateStatus/:estimationId/:status",Authenticate,updateStatus)
router.patch("/setPrice/:estimationId",Authenticate,setFinalPrice)

router.get("/:id/:fid",Authenticate,estimationsViewFiles)

router.patch(
  "/estimationLineItems/:lineItemId",
  Authenticate,
  updateEstimationLineItem
);

router.post("/estimationLineItems/create/:groupId",
  Authenticate,
  createLineItem
)

export  {router as estimation};