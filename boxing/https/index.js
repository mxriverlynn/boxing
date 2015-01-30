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

    // foward the stream
    return cb(undefined, httpsRes);
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

    var chunkyChicken = "";

    httpsRes.setEncoding("utf8");
    httpsRes.on('data', function (chunk) {
      chunkyChicken += chunk;
    });

    httpsRes.on("end", function(){
      var jsonData = JSON.parse(chunk);
      cb(null, jsonData);
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

    var chunkyStuff = "";

    httpsRes.setEncoding("utf8");
    httpsRes.on('data', function (chunk) {
      console.log(chunk);
      chunkyStuff += chunk;
    });

    httpsRes.on("end", function(){
      var jsonData = JSON.parse(chunkyStuff);
      cb(null, jsonData);
    });
  });

  httpsRequest.write(postParams);

  httpsRequest.on("error", function(err){
    return cb(err);
  });

  httpsRequest.end();
};

module.exports = HTTPSWrapper;
