import { Router } from 'express'
import registerComplain from '../controllers/complainControllers.js'
import { protect } from '../middleware/protect.js'

const router = Router()

///rate limiting is required for the register complain route
router.post('/register',protect,registerComplain);


export default router