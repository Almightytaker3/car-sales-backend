const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Contact = require('./models/Contact');
const Listing = require('./models/Listing');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.post('/submit-contact', async (req, res) => {
  const { Name, Email, Message } = req.body;
  await Contact.create({ Name, Email, Message });
  res.send('Contact message submitted!');
});

app.post('/submit-listing', async (req, res) => {
  const { CarModel, Year, Price, ImageURL } = req.body;
  await Listing.create({ CarModel, Year, Price, ImageURL });
  res.send('Listing submitted!');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid credentials');
  }
});

app.get('/dashboard', async (req, res) => {
  if (!req.session.authenticated) return res.redirect('/login');
  const contacts = await Contact.find();
  const listings = await Listing.find();
  res.render('dashboard', { contacts, listings });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
