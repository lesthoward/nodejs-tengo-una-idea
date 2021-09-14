const { Router } = require('express')
const router = Router()
const { request, response } = require('express')
const ideaController = require('../controllers/idea.controller')
const { isAuthenticated } = require('../controllers/auth.controller')


router.get('/ideas/:id', 
    isAuthenticated,
    ideaController.goToIdeas
)
router.post('/ideas/:id', 
    isAuthenticated,
    ideaController.addIdea
)
router.get('/ideas/edit/:id', 
    isAuthenticated,
    ideaController.showEdit
)
// router.post('/ideas/edit/:id/:originalUrl', ideaController.editIdea)

router.get('/ideas/delete/:id/:originalUrl', 
    isAuthenticated,
    ideaController.deleteIdea
)
router.get('/ideas/isComplete/:id/:originalUrl', 
    isAuthenticated,
    ideaController.completeIdea
)

router.get('/ideas/share/:url', 
    ideaController.shareIdea
)

module.exports = router