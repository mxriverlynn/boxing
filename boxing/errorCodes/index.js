var Registry = require("../registry");

// Error codes
// -----------
//
// codes and descriptions can be found at:
// https://www.dropbox.com/developers/core/docs#error-handling

var errors = new Registry();

errors.register(400, {
  name: "InputParameterError",
  message: "Bad input parameter."
});

errors.register(401, {
  name: "InvalidTokenError",
  message: "Bad or expired token. Please re-authenticate the user."
});

errors.register(403, {
  name: "OAuthRequestError",
  message: "Bad OAuth request."
});

errors.register(404, {
  name: "NotFoundError",
  message: "File or folder not found at the specified path."
});

errors.register(405, {
  name: "RequestMethodError",
  message: "Request method not expected (generally should be GET or POST)."
});

errors.register(429, {
  name: "TooManyRequestsError",
  message: "Your app is making too many requests and is being rate limited."
});

errors.register(503, {
  name: "RateLimitedError",
  message: "Your app is either being rate limited, or ran in to a transient error. Please try again."
});

errors.register(507, {
  name: "UserOverQuotaError",
  message: "User is over Dropbox storage quota."
});

errors.register(5, {
  name: "DropboxError",
  message: "Dropbox has encountered an unknown error."
});

// Module API
// ----------

var ErrorCodes = {
  fromResponse: function(response){
    var errorData, error;
    var code = response.statusCode;
    var message = response.message;

    // check to see if we have an error
    var hasError = errors.hasValue(code);

    // 5xx errors, other than the ones registered above,
    // need to be special case handled
    var is5Error = (code.toString().split("")[0] === "5");

    // this is a 5xx, unknown
    if (is5Error && !hasError){
      // get the 5xx error
      errorData = errors.getValue("5");
    }

    // do we have an error at all?
    if (hasError) {
      errorData = errors.getValue(code);
    }

    // if no error data, return nothing
    if (!errorData) { return; }

    // format and return the error
    error = new Error(errorData.message);
    error.code = code;
    error.name = errorData.name;

    return error;
  }
};

// Exports
// -------

module.exports = ErrorCodes;
