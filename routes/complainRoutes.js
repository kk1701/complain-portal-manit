import { Router } from 'express'
import registerComplain from '../controllers/complainControllers.js'
import {protect} from '../middleware/protect.js';

const router = Router()


router.post('/register',protect,registerComplain);


export default router