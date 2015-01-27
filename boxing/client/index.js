var path = require("path");
var HTTPS = require("../https");

// API URL Configuration
// ---------------------

var dropboxPaths = {
  accountInfo: "/1/account/info",
  delta: "/1/delta",
  files: "/1/files/auto/",
  createFolder: "/1/fileops/create_folder"
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
  this.https.get(dropboxPaths.accountInfo, function(err, accountInfo){
    cb(err, accountInfo);
  });
};

Client.prototype.delta = function(cursor, cb){
  if (!cb){ cb = cursor; }

  var postData = {
    cursor: cursor
  };

  this.https.post(dropboxPaths.delta, postData, function(err, delta){
    cb(err, delta);
  });
};

Client.prototype.file = function(file, cb){
  var filePath = path.join(dropboxPaths.files, file);
  this.https.getContent(filePath, function(err, fileStream){
    cb(err, fileStream);
  });
};

Client.prototype.createFolder = function(path, cb){
  if (!cb){ cb = cursor; }

  var postData = {
    root: "auto",
    path: path
  };

  this.https.post(dropboxPaths.createFolder, postData, function(err, delta){
    cb(err, delta);
  });
};

module.exports = Client;
