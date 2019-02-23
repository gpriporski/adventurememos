const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Adventure = mongoose.model('adventures')
// const User = mongoose.model('users')
const {
  ensureAuthenticated
} = require('../helpers/auth')

// Adventures Index
router.get('/', (req, res) => {
  Adventure.find({
    status: 'public'
  })
    .populate('user')
    .then(adventures => {
      res.render('adventures/index', {
        adventures: adventures
      })
    })
})

// Show Single Adventure
router.get('/show/:id', (req, res) => {
  Adventure.findOne({
    _id: req.params.id
  })
    .populate('user')
    .then(adventure => {
      res.render('adventures/show', {
        adventure: adventure
      })
    })
})

// Add Adventure Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('adventures/add')
})

// Edit Adventure Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Adventure.findOne({
    _id: req.params.id
  })
    .then(adventure => {
      res.render('adventures/edit', {
        adventure: adventure
      })
    })
})

// Process Add Adventure
router.post('/', (req, res) => {
  let allowComments
  if (req.body.allowComments) {
    allowComments = true
  } else {
    allowComments = false
  }

  const newAdventure = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  // Create Adventure
  new Adventure(newAdventure)
    .save()
    .then(adventure => {
      res.redirect(`/adventures/show/${adventure.id}`)
    })
})

// Process Edit Form
router.put('/:id', (req, res) => {
  Adventure.findOne({
    _id: req.params.id
  })
    .then(adventure => {
      let allowComments
      if (req.body.allowComments) {
        allowComments = true
      } else {
        allowComments = false
      }

      // Set the New Values
      adventure.title = req.body.title
      adventure.body = req.body.body
      adventure.status = req.body.status
      adventure.allowComments = allowComments

      adventure.save()
        .then(adventure => {
          res.redirect('/dashboard')
        })
    })
})

// Delete Adventure
router.delete('/:id', (req, res) => {
  Adventure.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/dashboard')
    })
})

module.exports = router
