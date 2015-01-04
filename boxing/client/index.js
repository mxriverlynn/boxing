var HTTPS = require("../https");

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
  this.https = new HTTPS({
    accessToken: config.accessToken
  });
};

// Instance Methods
// ----------------

Client.prototype.accountInfo = function(cb){
  this.https.get(paths.accountInfo, function(err, accountInfo){
    cb(err, accountInfo);
  });
};

Client.prototype.delta = function(cursor, cb){
  if (!cb){ cb = cursor; }

  var postData = {};
  this.https.post(paths.delta, postData, function(err, delta){
    cb(err, delta);
  });
};

module.exports = Client;
