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
    .sort({
      date: 'desc'
    })
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
    .populate('comments.commentUser')
    .then(adventure => {
      if (adventure.status == 'public') {
        res.render('adventures/show', {
          adventure: adventure
        })
      } else {
        if (req.user) {
          if (req.user.id == adventure.user._id) {
            res.render('adventures/show', {
              adventure: adventure
            })
          } else {
            res.redirect('adventures')
          }
        } else {
          res.redirect('adventures')
        }
      }
    })
})

// Show single Users' adventures
router.get('/user/:userId', (req, res) => {
  Adventure.find({
    user: req.params.userId,
    status: 'public'
  })
    .populate('user')
    .then(adventures => {
      res.render('adventures/index', {
        adventures: adventures
      })
    })
})

// Users My Adventures
router.get('/my', ensureAuthenticated, (req, res) => {
  Adventure.find({
    user: req.user.id
  })
    .populate('user')
    .then(adventures => {
      res.render('adventures/index', {
        adventures: adventures
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
      if (adventure.user != req.user.id) {
        res.redirect('/adventures')
      } else {
        res.render('adventures/edit', {
          adventure: adventure
        })
      }
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

// Add Comment
router.post('/comment/:id', (req, res) => {
  Adventure.findOne({
    _id: req.params.id
  })
    .then(adventure => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Add to comments arr
      adventure.comments.unshift(newComment)

      adventure.save()
        .then(adventure => {
          res.redirect(`/adventures/show/${adventure.id}`)
        })
    })
})

module.exports = router
