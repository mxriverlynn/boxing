var https = require("../https");

// API URL Configuration
// ---------------------

var paths = {
  host: "www.dropbox.com",
  accountInfo: "/1/account/info",
  delta: "/1/delta",
};

// Dropbox Client
// --------------

function Client(config){
  this.config = config;
};

// Instance Methods
// ----------------

Client.prototype.accountInfo = function(cb){
  https.get(paths.accountInfo, this.config.accessToken, function(err, accountInfo){
    cb(err, accountInfo);
  });
};

Client.prototype.delta = function(cursor, cb){
  if (!cb){ cb = cursor; }

  var postData = {};
  https.post(paths.delta, postData, this.config.accessToken, function(err, delta){
    cb(err, delta);
  });
};

module.exports = Client;
