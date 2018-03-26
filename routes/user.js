const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const sha1 = require('js-sha1');

// 1. user register
router.post('/', function (req, res) {

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: sha1(req.body.password),  // sha1
    email: req.body.email
  });

  user.save()
    .then(result => {
      res.status(200);
      res.send({
        status: 200,
        message: 'register success',
        data: {
          username: user.username
        }
      });
    })
    .catch(err => {
      res.status(400);
      res.send({
        status: 400,
        message: 'user already exist',
        data: {}
      });
    });
});

// 2. get user by id
router.get('/:username', function (req, res) {
  User.findOne({
      username: req.params.username
    })
    .exec()
    .then(user => {

      if (user) {
        res.status(200);
        res.send({
          status: 200,
          message: 'get user profile success',
          data: user
        });
      } else {
        res.status(400);
        res.send({
          status: 400,
          message: 'user is not found',
          data: {}
        });
      }

    })
    .catch(err => {
      res.status(500);
      res.send({
        status: 500,
        message: err.message,
        data: {}
      });
    });
});

// 3. get all user
router.get('/', function (req, res) {
  User.find()
    .exec()
    .then(result => {
      res.status(200);
      res.send({
        status: 200,
        message: 'get all users success',
        data: result
      });
    })
    .catch(err => {
      res.status(500);
      res.send({
        status: 500,
        message: err.message,
        data: {}
      });
    });
});

// 4. delete user
router.delete('/', function (req, res) {
  User.deleteOne({
      username: req.body.username,
      password: sha1(req.body.password)
    })
    .then(doc => {

      // if doc.result.n === 1, user did exist
      // if doc.result.n === 0, user did not exist

      res.status(200);
      res.send({
        status: 200,
        message: 'delete user success',
        data: {}
      });

    })
    .catch(err => {
      res.status(500);
      res.send({
        status: 500,
        message: err.message,
        data: {}
      });
    });
});

module.exports = router;
