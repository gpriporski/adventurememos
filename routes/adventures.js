const express = require('express')
const router = express.Router()
const {
  ensureAuthenticated
} = require('../helpers/auth')

// Adventures Index
router.get('/', (req, res) => {
  res.render('adventures/index')
})

// Add Adventure Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('adventures/add')
})

module.exports = router
