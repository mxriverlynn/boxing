var https = require("https");
var querystring = require("querystring");

var paths = {
  host: "www.dropbox.com",
  accountInfo: "/1/account/info"
};

function Client(config){
  this.config = config;
};

Client.prototype.accountInfo = function(cb){
  this._get(paths.accountInfo, function(err, accountInfo){
    cb(err, accountInfo);
  });
};

Client.prototype._get = function(path, cb){
  var options = {
    hostname: paths.host,
    port: 443,
    method: "GET",
    path: path,
    headers: {
      "Content-Length": "0",
      "Authorization": "Bearer " + this.config.accessToken
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

Client.prototype._post = function(path, postData, cb){
  var postParams = querystring.stringify(postData);

  console.log(path, postData);

  var options = {
    hostname: this.config.dropboxHostName,
    port: 443,
    method: "POST",
    path: path,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postParams.length
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

  httpsRequest.write(postParams);

  httpsRequest.on("error", function(err){
    return cb(err);
  });

  httpsRequest.end();
};

module.exports = Client;
