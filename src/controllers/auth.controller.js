const { request, response } = require('express')
const passport = require('passport')


const isAuthenticated = (req=request, res=response, next) => {
    
    if(req.isUnauthenticated()) {
        return res.redirect('/login')
    }
    
    next()
}


module.exports = {
    isAuthenticated
}