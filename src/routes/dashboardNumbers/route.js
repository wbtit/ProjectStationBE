import {Router} from 'express'
import {dashBoardNumbers,dailyWorkingHours} from '../../controllers/dashboardNumbers.js'
import Authenticate from '../../middlewares/authenticate.js'

const router=Router()

router.get("/dashBoardStats",Authenticate,dashBoardNumbers)
router.get("/dailyWorkingHours",Authenticate,dailyWorkingHours)

export {router as dashBoardStats}
