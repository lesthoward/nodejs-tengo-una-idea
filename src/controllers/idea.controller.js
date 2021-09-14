const { request, response } = require('express')
const Idea = require('../models/Idea')
const Objetive = require('../models/Objetive')

const goToIdeas = async (req=request, res=response) => {
    const { id } = req.params
    const objetiveUrl = id
    const uniqueObjetive = await Objetive.findOne({ where:{ url: id }})

    const severalIdeas = await Idea.findAll({
        where: {
            ObjetiveId: uniqueObjetive.id
        }
    })

    // if (!severalIdeas.length) return res.redirect('/objetives')
    res.render('ideas-layout', {
        title: 'Organizar objetivos' + res.locals.brandTitle,
        uniqueObjetive,
        severalIdeas,
        objetiveUrl
    })
}

const addIdea = async (req=request, res=response) => {
    const { name, description } = req.body
    const { id } = req.params
    try {
        await Idea.create({
            name,
            description,
            ObjetiveId: id
        })
    } catch (error) {
        req.flash('errorMessage', error.errors)
        return res.redirect('back')
    }
    req.flash('successMessage', 'La idea se ha asignado correctamente')
    res.redirect('back')
}

const showEdit = async (req=request, res=response) => {
    const { id } = req.params
    const uniqueIdea = await Idea.findOne({where: { id }})

    res.render('ideas-layout', {
        title: 'Editando idea' + res.locals.brandTitle,
        edit: true,
        uniqueIdea
    })
}

const editIdea = async (req=request, res=response) => {
    const { name, description } = req.body
    const { id } = req.params
    console.log(req.query);
    await Idea.update(
        { name, description },
        {where: { id }}   
    )
    res.redirect('/objetives')
}

const deleteIdea = async (req=request, res=response) => {
    const { id, originalUrl } = req.params
    await Idea.destroy({ where: { id }})
    res.redirect(`/ideas/${originalUrl}`)
}

const completeIdea = async (req=request, res=response) => {
    const { id, originalUrl } = req.params
    const uniqueIdea = await Idea.findOne({where: {id}})

    if (uniqueIdea.isComplete) {
        uniqueIdea.isComplete = false
    } else {
        uniqueIdea.isComplete = true
    }
    await uniqueIdea.save()
    res.redirect(`/ideas/${originalUrl}`)
}

const shareIdea = async (req=request, res=response) => {
    const uniqueObjetive = await Objetive.findOne({where: { url: req.params.url }})
    const severalIdeas = await Idea.findAll({
        where: {
            ObjetiveId: uniqueObjetive.id
        }
    })
    console.log(uniqueObjetive.isPublic);
    res.render('share',{
        title: 'Objetivo compartido' + res.locals.brandTitle,
        uniqueObjetive,
        severalIdeas
    })
}

module.exports = {
    addIdea,
    showEdit,
    goToIdeas,
    editIdea,
    deleteIdea,
    completeIdea,
    shareIdea
}