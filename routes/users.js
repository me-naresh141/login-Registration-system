var express = require('express')
var router = express.Router()
let userData = require('../modals/user')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  res.render('user')
})

// registration
router.get('/register', (req, res, next) => {
  let error = req.flash('error')
  res.render('registration', { error })
})

// handle registrations route
router.post('/register', (req, res, next) => {
  // console.log(req.body)
  let { name, email, password } = req.body
  if (!name || !email || !password) {
    req.flash('error', ' name/Email/password is required')
    return res.redirect('/users/register')
  }

  userData.create(req.body, (err, user) => {
    if (err) return next(err)
    let error = req.flash('error')
    res.render('login', { error })
  })
})

// login
router.get('/login', (req, res, next) => {
  let error = req.flash('error')
  res.render('login', { error })
})

// handle login routes
router.post('/login', (req, res, next) => {
  let { email, password } = req.body
  if (!email || !password) {
    req.flash('error', 'Email/password is required')
    return res.redirect('/users/login')
  }
  userData.findOne({ email }, (err, user) => {
    // no user
    if (!user) {
      req.flash('error', 'email is invalid')
      return res.redirect('/users/login')
    }
    // password comapre
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        req.flash('error', 'password is invalid')
        return res.redirect('/users/login')
      }
      // persist logged in user information
      req.session.userId = user.id
      res.redirect('/users')
    })
  })
})

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/users/login')
})

module.exports = router
