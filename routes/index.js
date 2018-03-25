const express = require('express');
const router = express.Router();
const sha1 = require('js-sha1');
const shortid = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

// Database
const database = {
  user_pw_tk: {}  // { username: { password: 'xxx', token: 'xxx' } }
};

// register
router.post('/register', function (req, res) {
  // TODO: add data to database

  const username = req.body.username;
  const password_hash = sha1(req.body.password_hash);

  // check username
  if (typeof database.user_pw_tk[username] !== 'undefined') {
    res.status(400);
    res.send({
      status: 400,
      message: 'username already exist',
      data: {}
    });
    return;
  }

  // check username from database
  database.user_pw_tk[username] = {
    password_hash: password_hash,
    token: shortid.generate()
  };
  res.status(200);
  res.send({
    status: 200,
    message: 'register success',
    data: {
      username: username
    }
  });
});

// login
router.post('/login', function (req, res) {

  const username = req.body.username;
  const password_hash = sha1(req.body.password_hash);
  const user = database.user_pw_tk[username];

  // check user_pw_tk
  if (typeof user === 'undefined') {
    res.status(400);
    res.send({
      status: 400,
      message: 'username does not exist',
      data: {
        username: username
      }
    });
    return;
  }

  // check password
  if (user.password_hash !== password_hash) {
    res.status(400);
    res.send({
      status: 400,
      message: 'password is incorrect',
      data: {
        username: username
      }
    });
    return;
  }

  res.status(200);
  res.send({
    status: 200,
    message: 'login success',
    data: {
      username: username,
      token: user.token
    }
  });
});

module.exports = router;
