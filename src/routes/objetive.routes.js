const { Router } = require('express')
const router = Router()
const objetiveController = require('../controllers/objetive.controller')
const { isAuthenticated } = require('../controllers/auth.controller')

router.get('/objetives', 
    isAuthenticated,
    objetiveController.showObjetives
)

router.post('/objetives', 
    isAuthenticated,
    objetiveController.createObjetive    
)

router.get('/objetives/edit/:url',
    isAuthenticated,
    objetiveController.showEditView
)

router.post('/objetives/edit/:url',
    isAuthenticated,
    objetiveController.editObjetive
)

router.get('/objetives/delete/:url',
    isAuthenticated,
    objetiveController.deleteObjetive
)

router.get('/objetives/isVisible/:url',
    isAuthenticated,
    objetiveController.isVisible
)


module.exports = router
