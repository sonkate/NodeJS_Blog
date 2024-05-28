const router = require('express').Router();
const passport = require('passport');
const axios = require('axios');
const { generators } = require('openid-client');
const qs = require('qs');
require('dotenv').config();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/twitter', (req, res)=>{
  console.log('longin ...');
  const codeVerifier = generators.codeVerifier();
  req.session.codeVerifier = codeVerifier;
  const url = 'https://twitter.com/i/oauth2/authorize';
  const codeChallenge = generators.codeChallenge(codeVerifier);
  const params = {
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.URL + '/auth/twitter/callback',
    scope: 'tweet.read users.read follows.read follows.write',
    state: 'state',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  };
  const authUrl = `https://twitter.com/i/oauth2/authorize?${qs.stringify(params)}`;
  // Redirect the user to the authorization URL
  res.redirect(authUrl);
});

router.get('/twitter/callback', (req, res)=>{
  const { code, state } = req.query;
  console.log('code: ', code);
  console.log('state: ', state);
  // Verify the state parameter
  if (state !== 'state') {
    return res.status(400).send('Invalid state parameter');
  }
  const codeVerifier = req.session.codeVerifier;
  const data = {
    code: code,
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.URL + '/auth/twitter/callback',
    code_verifier: codeVerifier
  };
  axiosConfig = {
    method: 'post',
    url: 'https://api.twitter.com/2/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  }
  axios(axiosConfig)
    .then(response => {
      console.log(response.data);
      // Store the access_token in the session
      req.session.user = response.data;
      // Redirect to '/'
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
    });
})

module.exports = router;