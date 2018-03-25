const express = require('express');
const router = express.Router();
const sha1 = require('js-sha1');
const shortid = require('shortid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

// Database
const DB = {
  userList: {}
};

// register
router.post('/register', function (req, res) {
  // TODO: add data to database

  const username = req.body.username;
  const password = sha1(req.body.password);

  // check username
  if (typeof DB.userList[username] !== 'undefined') {
    res.status(400);
    res.send({
      status: 400,
      message: 'username already exist',
      data: {}
    });
    return;
  }

  // check username from database
  DB.userList[username] = {
    password: password,
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
  const password = sha1(req.body.password);
  const user = DB.userList[username];

  // check userList
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
  if (user.password !== password) {
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
