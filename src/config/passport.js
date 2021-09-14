const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

const passportConfig = passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        const user = await User.findOne({where:{ email }})
        if(!user) return done(null, false, {message: 'El correo no está registrado'})
        if(!user.verifyPassword(password)) return done(null, false, {message: 'Contraseña incorrecta'})
        if(parseInt(user.isVerify) !== 1) return done(null, false,{message: 'Primero tienes que confirmar tu correo eletrónico'})
        return done(null, user)
    }
))
// ! ¿EROR?
passportConfig.serializeUser((user, done) => {
    done(null, user)
})

passportConfig.deserializeUser((user, done) => {
    done(null, user)
})

module.exports = passportConfig