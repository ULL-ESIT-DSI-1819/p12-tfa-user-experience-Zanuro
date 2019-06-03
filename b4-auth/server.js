'use strict';
const pkg = require('./package.json');
const {URL} = require('url');
const path = require('path');

// nconf configuration.
const nconf = require('nconf');
nconf
  .argv()
  .env('__')
  .defaults({'NODE_ENV': 'development'});

const NODE_ENV = nconf.get('NODE_ENV');
const isDev = NODE_ENV === 'development';
nconf
  .defaults({'conf': path.join(__dirname, `${NODE_ENV}.config.json`)})
  .file(nconf.get('conf'));

const serviceUrl = new URL(nconf.get('serviceUrl'));
const servicePort = "60900";

// Express and middleware.
const express = require('express');
const morgan = require('morgan');

const app = express();

const expressSession = require('express-session');
if(isDev){
    const FileStore = require('session-file-store')(expressSession);
    app.use(expressSession({
        resave:false,
        saveUninitialized: true,
        secret: 'unguessable',
        store: new FileStore(),
    }));
}
else{
    //
}

const passport =  require('passport');
passport.serializeUser((profile,done) => done(null, {
    id: profile.id,
    provider: profile.provider,
}));
passport.deserializeUser((user,done) => done(null,user));
app.use(passport.initialize());
app.use(passport.session());
/*
const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: nconf.get('auth:facebook:appID'),
    clientSecret: nconf.get('auth:facebook:appSecret'),
    callbackURL: new URL('/auth/facebook/callback', serviceUrl).href,
    }, (acessToken, refreshToken, profile, done) => done(null, profile)));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    sucessRedirect: '/',
    failureRedirect: '/',
}));
*/
const TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
  consumerKey: nconf.get('auth:twitter:consumerKey'),
  consumerSecret: nconf.get('auth:twitter:consumerSecret'),
  callbackURL: new URL('/auth/twitter/callback', serviceUrl).href,
}, (accessToken, tokenSecret, profile, done) => done(null, profile)));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/',
}));

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: nconf.get('auth:google:clientID'),
  clientSecret: nconf.get('auth:google:clientSecret'),
  callbackURL: new URL('/auth/google/callback', serviceUrl).href,
  scope: 'https://www.googleapis.com/auth/plus.login',
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']}));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));

const GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
  clientID: nconf.get('auth:github:clientID'),
  clientSecret: nconf.get('auth:github:clientSecret'),
  callbackURL: new URL('/auth/github/callback', serviceUrl).href,
}, (accessToken, tokenSecret, profile, done) => done(null, profile)));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/',
}));




app.use(morgan('dev'));

app.get('/api/version', (req, res) => res.status(200).json(pkg.version));

// Serve webpack assets.
if (isDev) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('./webpack.config.js');
  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: '/',
    stats: {colors: true},
  }));
} else {
  app.use(express.static('dist'));
}


app.get('/api/session', (req,res) => {
    const session = {auth: req.isAuthenticated()};
    res.status(200).json(session);
});

app.get('/auth/signout', (req,res) => {
    req.logout();
    res.redirect('/');
});


app.use('/api', require('./lib/bundle.js')(nconf.get('es')));
app.listen(servicePort, () => console.log('Ready.'));