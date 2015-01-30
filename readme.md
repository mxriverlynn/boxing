# boxing - terrible dropbox api wrapper and express middleware

you're better off not using this, cause i only wrote it to solve my needs

## Express Middleware

```js
var express = require("express");
var boxing = require("boxing");

var app = express();

// configure a session, cause i store the oAuth data
// on the session, after you authorize the app
app.use(session({
  secret: "some secret key",
  resave: false,
  saveUninitialized: true,
  rolling: true
}));

// mount on a path where dropbox authorization will happen
// visit exmaple.com/dropbox/authorize to authorize this web app
// to use your dropbox account.
app.use("/dropbox", boxing.middleware({
  express: express,
  key: myDropboxAppKey,
  secret: myDropboxSecret,
  redirect: "/some-redirect/after-authorizing/dropbox"
}));
```

## Dropbox Client Object

```js
var boxing = require("boxing");

var client = new boxing.Client({
  accessToken: "your oAuth2 access token"
});
```

From here, you can call the dropbox API methods.

### Client#accountInfo

Get the account info for the user

```js
client.accountInfo(function(err, accountInfo){
  // ...
  // returns a JS object literal with account information
});
```

### Client#deltaLatestCursor

Get the latest delta cursor. This can be used to prevent
the full list of all files from coming back, the first time
you call the `delta` method

```js
client.deltaLatestCursor(function(err, deltaCursor){
  // ...
});
```

Be sure to save the cursor result somewhere, so you can use 
this on the next call to the `delta` method.

### Client#delta

Get the latest set of changes, based on the "cursor" that
you pass in. If no cursor is specified, you will receive
notice of everything in the dropbox account.

```js
client.delta("(dropbox delta cursor)", function(err, delta){
  // ...
  // returns a JS object literal w/ delta information
});
```

Be sure to save the `delta.cursor` result somewhere, so you can use 
this on the next call to the `delta` method.

### Client#file

Stream the file contents down from Dropbox

```js
client.file("/some/file.mp3", function(err, fileStream){
  // ...
  // returns a file as a stream, coming straight from dropbox
});
```

### Client#folderExists

Check to see if a specified folder exists.

```js
client.folderExists("/some/folder", function(err, exists){
  // ...
});
```

The `exists` boolean returns true if the specified folder is
found, and is a folder (not a file).

### Client#createFolder

Create a folder in the user's Dropbox. This method assumes
"auto" path root.

```js
client.createFodler("/some/folder", function(err, result){
  // ...
});
```

## legal junk

Copyright &copy;2015 Muted Solutions, LLC.

Distributed under [MIT license](http://mutedsolutions.mit-license.org).
