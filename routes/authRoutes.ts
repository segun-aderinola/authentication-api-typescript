import {Router, Application, Request, Response, NextFunction} from 'express'
const authController = require('../controllers/authController');
const router = Router()

router.get('/signup', authController.signup_get)
router.get('/', authController.login_get)
router.post('/signup', authController.signup_post)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)


export default router;