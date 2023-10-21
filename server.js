const express = require('express');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const app = express();
const csurf = require('csurf');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser')

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'seif09', resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(csurf({ cookie: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index', { csrfToken: req.csrfToken() });
  });

  app.post('/login', (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, render the form again with error messages
      return res.render('index', { csrfToken: req.csrfToken(), errors: errors.array() });
    }
  // Validate and authenticate the user
  // Implement appropriate validation and secure authentication mechanisms here
  // For simplicity, you can use a hardcoded username and password for demonstration purposes

  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'seif09');
    req.session.isAuthenticated = true;
    res.redirect('/dashboard?token=' + token);
  } else {
    res.redirect('/');
  }
});

app.get('/dashboard', (req, res) => {
    // Secure the dashboard route to only allow authenticated users
    if (req.session.isAuthenticated) {
      const token = req.query.token;
      try{
        const decoded = jwt.verify(token, 'hajar99');
        res.render('dashboard', { username : decoded.username });
      } catch(err){
        console.error(err);
        res.redirect('/');
      }
  
    } else {
      res.redirect('/');
    }
  });
  
  // Start server
  app.listen(3000, _ => {console.log('Server started on port 3000')});