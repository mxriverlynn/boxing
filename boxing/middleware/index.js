var querystring = require("querystring");
var AuthApi = require("../authorization");

// url and path constants
// ----------------------

var AUTH_PATH = "/authorize"
var REDIRECT_PATH = "/bearer-code";

var DROPBOX_AUTH_URL = "https://www.dropbox.com/1/oauth2/authorize?response_type=code&redirect_uri=#{redirect}&client_id=#{key}";
var DROPBOX_HOST_NAME = "www.dropbox.com";
var DROPBOX_TOKEN_PATH = "/1/oauth2/token";

// dropbox urls and stuff
// ---------------------

function getDropboxAuthToken(authApi){

  return function(req, res, next){
    authApi.getAuthorizationUrl(req, function(err, url){
      res.redirect(url);
    });
  }

}

function getDropboxAccessToken(authApi, redirectOnAuth){

  return function(req, res, next){
    var code = req.query.code;
    var redirectUrl = authApi.getRedirectUrl(req);
    console.log(redirectUrl);

    authApi.requestAccessToken(code, redirectUrl, function(err, accessToken){
      if (err) { return next(err); }

      req.session.oAuth = accessToken;
      res.redirect(redirectOnAuth);
    });
  }

}

function getAuthApiConfig(config){
  var authApiConfig = {
    secret: config.secret,
    key: config.key,
    authPath: AUTH_PATH,
    redirectPath: REDIRECT_PATH,
    dropboxAuthUrl: DROPBOX_AUTH_URL,
    dropboxHostName: DROPBOX_HOST_NAME,
    dropboxTokenPath: DROPBOX_TOKEN_PATH
  };

  return authApiConfig;
}

// Middleware
// ----------

function middleware(config){
  var express = config.express;
  var redirectOnAuth = config.redirect;

  var authApiConfig = getAuthApiConfig(config);
  var authApi = new AuthApi(authApiConfig);

  var router = express.Router();
  router.get(authApiConfig.authPath, getDropboxAuthToken(authApi));
  router.get(authApiConfig.redirectPath, getDropboxAccessToken(authApi, redirectOnAuth));

  return router;
}

module.exports = middleware;
