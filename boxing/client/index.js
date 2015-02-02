var _ = require("underscore");
var path = require("path");
var HTTPS = require("../https");

// API URL Configuration
// ---------------------

var dropboxPaths = {
  accountInfo: "/1/account/info",
  delta: "/1/delta",
  deltaLatestCursor: "/1/delta/latest_cursor",
  files: "/1/files/auto/",
  createFolder: "/1/fileops/create_folder",
  search: "/1/search/auto/"
};

// Dropbox Client
// --------------

function Client(config){
  this.config = config;
  this.https = new HTTPS({
    accessToken: config.accessToken
  });
};

// Account Methods
// ---------------

Client.prototype.accountInfo = function(cb){
  this.https.get(dropboxPaths.accountInfo, function(err, accountInfo){
    cb(err, accountInfo);
  });
};

// Delta Methods
// -------------

Client.prototype.delta = function(cursor, cb){
  if (!cb){ cb = cursor; }

  var postData = {
    cursor: cursor
  };

  this.https.post(dropboxPaths.delta, postData, function(err, delta){
    cb(err, delta);
  });
};

Client.prototype.deltaLatestCursor = function(path, cb){
  if (!cb){ 
    cb = path; 
    path = undefined;
  }

  var postData = {};
  if (path){
    postData.path = path;
  }

  this.https.post(dropboxPaths.deltaLatestCursor, postData, function(err, result){
    cb(err, result.cursor);
  });
};

// File / Folder Methods
// ---------------------

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

  this.https.post(dropboxPaths.createFolder, postData, function(err, result){
    cb(err, result);
  });
};

Client.prototype.folderExists = function(path, cb){
  var options = {
    file_limit: 0,
    include_deleted: false
  };

  this.search(path, options, function(err, results){
    if (err) { return cb(err); }

    if (results.length === 0) {
      return cb(undefined, false);
    }

    var result = results[0];
    var exists = result.is_dir;

    return cb(undefined, exists);
  });
};

// Content Related Methods
// -----------------------

Client.prototype.search = function(query, options, cb){
  if (!cb) { 
    cb = options;
    options = {};
  }

  var rootPath = options.path || "";
  options.path = undefined;

  options = _.defaults(options, {
    query: query,
    include_deleted: false,
    include_membership: false,
    file_limit: 1000
  });

  var url = path.join(dropboxPaths.search, rootPath);

  this.https.post(url, options, function(err, result){
    cb(err, result);
  });
};

module.exports = Client;
