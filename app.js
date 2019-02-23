const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

// Load Models
require('./models/User')
require('./models/Adventure')

// Passport Config
require('./config/passport')(passport)

// Load Routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const adventures = require('./routes/adventures')

// Load Keys
const keys = require('./config/keys')

// Load Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select
} = require('./helpers/hbs')

// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

const app = express()

// ================================ Middlewares ==================== //

// Body parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// Method Override Middleware
app.use(methodOverride('_method'))

// Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select
    },
    defaultLayout: 'main'
  })
)
app.set('view engine', 'handlebars')

// Cookie Middleware
app.use(cookieParser())

// Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// ========================= End of Middlewares ================ //

// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Use Routes
app.use('/', index)
app.use('/auth', auth)
app.use('/adventures', adventures)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
