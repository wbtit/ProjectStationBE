import {Router} from 'express'
import {dashBoardNumbers} from '../../controllers/dashboardNumbers.js'
import Authenticate from '../../middlewares/authenticate.js'

const router=Router()

router.get("/dashBoardStats",Authenticate,dashBoardNumbers)

export {router as dashBoardStats}
