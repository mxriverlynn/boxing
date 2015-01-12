var https = require("https");
var querystring = require("querystring");
var errorCodes = require("../errorCodes");

// HTTP Methods
// ------------

function HTTPSWrapper(config){
  this.config = config || {};
};

HTTPSWrapper.prototype.getContent = function(path, cb){
  var token = this.config.accessToken;

  var options = {
    hostname: "api-content.dropbox.com",
    port: 443,
    method: "GET",
    path: path,
    headers: {
      "Content-Length": "0",
      "Authorization": "Bearer " + token
    }
  };

  var fileBuffer = new Buffer(0);
  var httpsRequest = https.request(options, function(httpsRes){

    // handle error response codes
    var error = errorCodes.fromResponse(httpsRes);
    if (error ) { return cb(error); }

    // handle non-error response
    httpsRes.on("data", function (chunk) {
      fileBuffer = Buffer.concat([fileBuffer, chunk]);
    });

    httpsRes.on("end", function(){
      cb(null, fileBuffer);
    });
  });

  httpsRequest.on("error", function(err){
    return cb(err);
  });

  httpsRequest.end();
};

HTTPSWrapper.prototype.get = function(path, cb){
  var token = this.config.accessToken;

  var options = {
    hostname: "www.dropbox.com",
    port: 443,
    method: "GET",
    path: path,
    headers: {
      "Content-Length": "0",
      "Authorization": "Bearer " + token
    }
  };

  var httpsRequest = https.request(options, function(httpsRes){
    // handle error response codes
    var error = errorCodes.fromResponse(httpsRes);
    if (error ) { return cb(error); }

    httpsRes.setEncoding("utf8");
    httpsRes.on('data', function (chunk) {
      console.log(chunk);
      var accessToken = JSON.parse(chunk);
      cb(null, accessToken);
    });
  });

  httpsRequest.on("error", function(err){
    return cb(err);
  });

  httpsRequest.end();
};

HTTPSWrapper.prototype.post = function(path, postData, cb){
  var postParams = querystring.stringify(postData);

  var options = {
    hostname: "www.dropbox.com",
    port: 443,
    method: "POST",
    path: path,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postParams.length
    }
  };

  var token = this.config.accessToken;
  if (token){
    options.headers.Authorization = "Bearer " + token
  }

  var httpsRequest = https.request(options, function(httpsRes){
    // handle error response codes
    var error = errorCodes.fromResponse(httpsRes);
    if (error ) { return cb(error); }

    httpsRes.setEncoding("utf8");
    httpsRes.on('data', function (chunk) {
      console.log(chunk);
      var accessToken = JSON.parse(chunk);
      cb(null, accessToken);
    });
  });

  httpsRequest.write(postParams);

  httpsRequest.on("error", function(err){
    return cb(err);
  });

  httpsRequest.end();
};

module.exports = HTTPSWrapper;
