var HTTPS = require("../https");
var querystring = require("querystring");

// Dropbox Authorization API
// -------------------------

function AuthApi(config){
  this.config = config;
  this.https = new HTTPS();
}

// Instance Members
// ----------------

AuthApi.prototype.getRedirectUrl = function(req){
  var protocol = getProtocol(req);
  var hostWithPort = req.get("host");
  var baseUrl = req.baseUrl;
  var redirectPath = this.config.redirectPath;

  var url = protocol + "://" + hostWithPort + baseUrl + redirectPath;

  return url;
};

AuthApi.prototype.getAuthorizationUrl = function(req, cb){
  var key = this.config.key;
  var url = this.config.dropboxAuthUrl;

  var redirect = this.getRedirectUrl(req); 
  redirect = querystring.escape(redirect);

  url = url.replace("#{redirect}", redirect);
  url = url.replace("#{key}", key);

  cb(null, url);
};

AuthApi.prototype.requestAccessToken = function(authorizationCode, redirectUrl, cb){
  var postData = {
    code: authorizationCode,
    grant_type: "authorization_code",
    client_id: this.config.key,
    client_secret: this.config.secret,
    redirect_uri: redirectUrl
  };

  var tokenPath = this.config.dropboxTokenPath;
  this.https.post(tokenPath, postData, cb);
};

// helpers
// -------

function getProtocol(req){
  var protocol = req.get("x-forwarded-proto") || req.protocol;
  return protocol;
}

// Exports
// -------

module.exports = AuthApi;
