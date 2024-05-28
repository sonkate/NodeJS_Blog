const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const axios = require("axios");
const authRoutes = require("./routes/auth-routes");
const passportSetup = require("./config/passport-setup");
const session = require('express-session');
const passport = require('passport');
const qs = require('qs');
const _ = require('lodash');
const { access } = require("fs");
require('dotenv').config();

const app = express();
app.use(session({secret: 'secret_', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes);
// template engine
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "hdb",
  engine({
    extname: ".hdb",
  })
);
app.set("view engine", "hdb");
app.set("views", path.join(__dirname, "resources/views"));

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(morgan("combined"));

app.get("/", async(req, res) => {
  console.log('user: ', req.session.user);
  // after login sucess, user will be redirect to /, we need to call twitter api to get user profile and store to session
  if (req.session.user && req.session.user.profile === undefined) {
    const accessToken = req.session.user.access_token;
    try {
      const response = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      req.session.user.profile = response.data;
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while trying to fetch user data');
    }
  }
  res.render("home");
});

app.get("/search", (req, res) => {
  res.render("news");
});

// return list of followers
app.get("/relationship", async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://twitter154.p.rapidapi.com/user/followers',
    params: {
      user_id: process.env.USER_ID
    },
    headers: {
      'X-RapidAPI-Key': '5902435ae8mshc26bb55247b0266p1d2e95jsn45530b90c934',
      'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    listUserID = _.map(response.data.results, 'user_id');
    console.log(listUserID);
    if (req.session.user.profile.id in listUserID) {
      res.send('User is following you');
    }
    else {
      res.send('User is not following you');
    }
  } catch (error) {
    console.error(error);
  }
});




  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});