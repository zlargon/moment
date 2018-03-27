const express = require('express');
const router = express.Router();
const sha1 = require('js-sha1');
const shortid = require('shortid');

const mongoose = require('mongoose');
const User = require('../models/UserModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

// 1. user login
router.get('/auth', function (req, res) {

  User.findOne({
      username: req.query.username,
      password: sha1(req.query.password)
    })
    .exec()
    .then(user => {

      if (user) {
        res.status(200).json({
          status: 200,
          message: 'login success',
          data: {
            username: user.username,
            email: user.email,
            token: user.token,
            article: user.article
          }
        });

      } else {
        res.status(400).json({
          status: 400,
          message: 'username or password is wrong',
          data: {}
        });
      }

    })
    .catch(err => {
      res.status(500).json({
        status: 500,
        message: err.message,
        data: {}
      });
    });
});

module.exports = router;
