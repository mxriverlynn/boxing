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

### Client Methods

There aren't very many methods, because I don't need
very many for my current apps.

#### Client#accountInfo

```js
client.accountInfo(function(err, accountInfo){
  // ...
  // returns a JS object literal with account information
});
```

#### Client#delta

```js
client.delta("(dropbox delta cursor)", function(err, delta){
  // ...
  // returns a JS object literal w/ delta information
});
```

#### Client#file

```js
client.file("/some/file.mp3", function(err, fileBuffer){
  // ...
  // returns a file as a Buffer object
});
```

## legal junk

Copyright &copy;2015 Muted Solutions, LLC.

Distributed under [MIT license](http://mutedsolutions.mit-license.org).
