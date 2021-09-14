const { Router, request, response } = require('express')
const router = Router()

router.get('/', (req=request, res=response) => {
    res.redirect('/login')
    // res.render('homepage')
})

router.get('/login', (req=request, res=response) => {
    res.render('login', {
        title: 'Iniciar sesión' + res.locals.brandTitle
    })
})

router.get('/register', (req=request, res=response) => {
    res.render('register', {
        title: 'Crear una cuenta' + res.locals.brandTitle,
        person: {}
    })
})

router.get('/forget', (req=request, res=response) => {
    res.render('forget', {
        title: 'Olvidé mi contraseña' + res.locals.brandTitle
    })
})


router.get('/emails/forget', (req=request, res=response) => {
    res.render('emails/token', {
        title: 'Restablecer contraseña' + res.locals.brandTitle
    })
})



module.exports = router