const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const sha1 = require('js-sha1');
const shortid = require('shortid');

// 1. user register
router.post('/', function (req, res) {

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: sha1(req.body.password),  // sha1
    email: req.body.email,
    token: shortid.generate()
  });

  user.save()
    .then(result => {
      res.status(200).json({
        status: 200,
        message: 'register success',
        data: {
          username: user.username,
          email: user.email,
          token: user.token
        }
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 400,
        message: err,
        data: {}
      });
    });
});

// 2. get user by id
router.get('/:username', function (req, res) {
  User.findOne({
      username: req.params.username,
      token: req.query.token
    })
    .exec()
    .then(user => {

      if (user) {
        res.status(200).json({
          status: 200,
          message: 'get user profile success',
          data: {
            username: user.username,
            email: user.email,
            article: user.article
          }
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'user is not found',
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

// 3. get all user
router.get('/', function (req, res) {
  User.find()
    .exec()
    .then(users => {
      res.status(200).json({
        status: 200,
        message: 'get all users success',
        data: users.map(o => o.username)
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 500,
        message: err.message,
        data: {}
      });
    });
});

// 4. delete user
router.delete('/', function (req, res) {
  User.findOneAndRemove({
      username: req.body.username,
      password: sha1(req.body.password)
    })
    .then(user => {

      if (user) {
        res.status(200).json({
          status: 200,
          message: 'delete user success',
          data: {
            username: user.username
          }
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'user is not found and cannot be delete',
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
