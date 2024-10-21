import { Router } from 'express'
import registerComplain from '../controllers/complainControllers.js'

const router = Router()

router.post('/register', registerComplain)

export default router