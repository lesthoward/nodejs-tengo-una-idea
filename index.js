const { request, response } = require('express')
const express = require('express')
const app = express()
const port = process.env.PORT || 1010
const path = require('path')
require('dotenv').config()
// FUNCIONALLY IMPORTS
const sequelize = require('./src/config/db-conncection')
const session = require('express-session')
const flash = require('connect-flash')
const helpers = require('./src/helpers/funcions.helper')
const passportConfig = require('./src/config/passport')

// DATABASE CONNECTION
try {
    require('./src/models/User')
    require('./src/models/Objetive')
    require('./src/models/Idea')
    sequelize.sync({alter: true})
    console.log('Connection has been established successfully');

} catch (error) {
    console.log('Unable to connect to the database',error);
}


// STATIC CONTENT
app.use(express.static('public'))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './src/views'))


// MIDDLEWARES
app.use(express.urlencoded({extended:true}))
app.use(express.json())
// Save sessions
app.use(session({
    secret: process.env.SCREET_KEY,
    resave: false,
    saveUninitialized: false
}))
// Connects information between views
app.use(flash())
// Global varialbes
app.use(passportConfig.initialize())
app.use(passportConfig.session())
// Personal middlewares
app.use((req=request, res=response, next) => {
    res.locals.brandTitle = ' | Tengo Una Idea'
    res.locals.var_dump = helpers.var_dump
    res.locals.authErrors = req.flash('authErrors')
    res.locals.authSuccess = req.flash('authSuccess')
    res.locals.token = req.flash('token')
    res.locals.successMessage = req.flash('successMessage')
    res.locals.errorMessage = req.flash('errorMessage')
    res.locals.message = req.flash()
    res.locals.user = req.user || null
    
    // const user = {
    //     id: 1
    // }
    // res.locals.user = user
    next()
})


// ROUTES
const userRoutes = require('./src/routes/user.routes')
const objetiveRoutes = require('./src/routes/objetive.routes')
const ideaRoutes = require('./src/routes/idea.routes')
app.use('/', require('./src/routes/index.routes'))
app.use('/user', userRoutes)
app.use('/', objetiveRoutes)
app.use('/', ideaRoutes)




app.listen(port, () => {
    console.log('Listening on port', port);
})


