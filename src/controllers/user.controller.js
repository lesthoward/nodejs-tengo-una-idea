const { request, response } = require('express')
const User = require('../models/User')
const passport = require('passport')
const { SendEmail, HtmlEmailTemplate } = require('../handlers/nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt')


const readUser = passport.authenticate('local', {
    successRedirect: '/objetives',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Los campos son obligatorios'
})

const createUser = async (req=request, res=response) => {
    const tokenVerify = crypto.randomBytes(40).toString('hex')
    const verifyURL = req.headers.origin + '/user/verify/' + tokenVerify
    
    try {   
        
        const user = await User.create(req.body)
        user.isVerify = tokenVerify
        await user.save()
        
        req.flash('authSuccess', 'Se te ha enviado un correo de confirmación')
        
        
    } catch (error) {
        req.flash('authErrors', error.errors)
        return res.render('register', {
            title: 'Crear una cuenta' + res.locals.brandTitle,
            authErrors: req.flash('authErrors'),
            person: req.body
        })
    }
    
    SendEmail(
        'Empieza a plasmar tus ideas | Tengo Una Idea',  
        HtmlEmailTemplate(verifyURL, 'corfimEmail'),
        req.body.email
    )
    res.redirect('/login')
    
}

const forget = async (req=request, res=response) => {
    const { email } = req.body
    const user = await User.findOne({
        where: {
            email
        }
    })

    if(user) {
        // Generates token and save to user
        const token = crypto.randomBytes(40).toString('hex')
        const tokenExpiredDate = Date.now() + 3600000
        user.token = token
        user.tokenExpiredDate = tokenExpiredDate
        await user.save()
        // Useful to the email template
        req.flash('authSuccess', 'Se te ha enviado un correo para resetear tu contraseña')
        
        const tokenURL = req.headers.origin + '/user/token/' + token

        await SendEmail(
            'Tu solicitud ha sido atendida',  
            HtmlEmailTemplate(tokenURL, 'token'),
            req.body.email
            )

        return res.redirect('/login')
    }
    
    req.flash('authErrors', 'El correo no está registrado')
    res.redirect('/forget')
        
}

const gettingToken = async (req=request, res=response) => {
    const token = req.params.token
    const user = await User.findOne({where:{ token }})
    if(!user) {
        return res.render('login', { 
            title: 'Iniciar Sesión' + res.locals.brandTitle,
            customMesagge: 'No puedes restablecer tu contrasea con un enlace inválido' 
        })
    }

    if((user.tokenExpiredDate > Date.now()) === false) {
        return res.render('login', { 
            title: 'Iniciar Sesión' + res.locals.brandTitle,
            customMesagge: 'No puedes restablecer contrasea con un enlace expirado' 
        })
    }

    res.render('reset-password', {
        title: 'Restablecer contraseña' + res.locals.brandTitle,
        token
    })
}

const resetPassword = async (req=request, res=response) => {
    const token = req.params.token
    const { password } = req.body
    // const user = await User.findOne({where:{ token }})
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    try {
        await User.update(
            { 
                password: hash,
                isVerify: 1,
                token: null,
                tokenExpiredDate: null
            },
            {where: { token: token }}
        )
        res.redirect('/')
    } catch (error) {
        console.log('Error');
        const authErrors = error.errors
        console.log('file: user.controller.js ~ line 115 ~ resetPassword ~ authErrors', authErrors)
        return res.render('reset-password', {
            title: 'Restablecer contraseña' + res.locals.brandTitle,
            token,
            authErrors
        })
    }

  
}

const confirmEmail = async (req=request, res=response) => {
    const user = await User.findOne({where:{ isVerify: req.params.token }})
    if(!user) {
        req.flash('authErrors', 'No se puede verificar un correo que no existe o ya es válido')
        return res.redirect('/login')
    }
    
    user.isVerify = 1
    user.save()
    req.flash('authSuccess', 'Se ha confirmado tu dirección de correo')
    res.redirect('/login')
}

const logout = (req=request, res=response) => {
    req.session.destroy()
    res.redirect('/')
}

module.exports = {
    createUser,
    forget,
    readUser,
    gettingToken,
    confirmEmail,
    resetPassword,
    logout
}