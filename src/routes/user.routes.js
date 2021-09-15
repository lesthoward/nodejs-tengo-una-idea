const { Router, request, response } = require('express')
const router = Router()
const userController= require('../controllers/user.controller')
const { body } = require('express-validator')

// USER ROUTER
router.post('/login', 
    body('email').trim().escape(),
    userController.readUser
)
router.post('/create', 
    body('email').trim().escape(),
    userController.createUser
)
router.post('/forget', 
body('email').trim().escape(),
    userController.forget
)
router.get('/token/:token', userController.gettingToken)
router.post('/reset/:token', userController.resetPassword)
router.get('/verify/:token', userController.confirmEmail)
router.get('/out', userController.logout)
module.exports = router