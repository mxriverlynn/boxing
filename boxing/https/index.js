var https = require("https");
var querystring = require("querystring");

// HTTP Methods
// ------------

function HTTPSWrapper(config){
  this.config = config;
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
