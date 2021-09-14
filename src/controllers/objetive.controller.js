const { request, response } = require('express')
const Idea = require('../models/Idea')
const Objetive = require('../models/Objetive')

const showObjetives  = async (req=request, res=response) => {
    const objetives = await Objetive.findAll({
        where: { userId: res.locals.user.id }
    })

    res.render('objetives-layout', {
        title: 'Organizar objetivos' + res.locals.brandTitle,
        objetives
    })
}

const createObjetive = async (req=request, res=response) => {
    const { name } = req.body
    try {
        await Objetive.create({
            name,
            url : name,
            userId: res.locals.user.id
        })
    } catch (error) {
        req.flash('errorMessage', error.errors)
        return res.redirect('/objetives')
    }
    req.flash('successMessage', `El objetivo "${name}" ha sido creado`)
    res.redirect('/objetives')
}

const showEditView = async (req=request, res=response) => {
    const { url } = req.params


    const proObjetives = Objetive.findAll({
        where: { userId: res.locals.user.id }
    })

    const proUniqueObjetive = Objetive.findOne({
        where: { url }
    })

    const [objetives, uniqueObjetive] = await Promise.all([proObjetives, proUniqueObjetive])

    res.render('objetives-layout', {
        title: 'Organizar objetivos' + res.locals.brandTitle,
        edit: true,
        objetives,
        uniqueObjetive
    })
}

const editObjetive = async (req=request, res=response) => {
    const { name } = req.body
    const { url } = req.params
    await Objetive.update(
        { name },
        { where: { url }}
    )
    req.flash('successMessage', `El objetivo "${name}" fue modificado exitosamente`)
    res.redirect('/objetives')
}

const deleteObjetive = async (req=request, res=response) => {
    const { url } = req.params
    const uniqueObjetive = await Objetive.findOne({ where: { url }})
    try {
        req.flash('successMessage', `El objetivo "${uniqueObjetive.name}" se eliminó correctamente`)
        await uniqueObjetive.destroy()
    } catch (error) {    
        req.flash('errorMessage', `El objetivo "${uniqueObjetive.name}" NO se pudo eliminar`)
    }
    res.redirect('/objetives')
}

const isVisible = async (req=request, res=response) => {
    const { url } = req.params
    const uniqueObjetive = await Objetive.findOne({ where: { url }})

    if(uniqueObjetive.isPublic){
        uniqueObjetive.isPublic  = false
    } else {
        uniqueObjetive.isPublic  = true
    }
    await uniqueObjetive.save()

    res.redirect('/objetives')
}

module.exports = {
    showObjetives,
    createObjetive,
    showEditView,
    editObjetive,
    deleteObjetive,
    isVisible,
}