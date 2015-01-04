var https = require("../https");
var querystring = require("querystring");

var https = require("../https");

// dropbox urls and stuff
// ---------------------

function AuthApi(config){
  this.config = config;
}

AuthApi.prototype.getRedirectUrl = function(req){
  var protocol = req.protocol;
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
  https.post(tokenPath, postData, cb);
};

module.exports = AuthApi;
