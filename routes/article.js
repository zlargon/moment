const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const Article = require('../models/article');

// 1. post article
router.post('/', function(req, res) {

  User.findOne({
      username: req.body.username,
      token: req.body.token
    })
    .exec()
    .then(user => {

      if (!user) {
        res.status(400).json({
          status: 400,
          message: 'user is unauthorized',
          data: {}
        });

      } else {

        const article = new Article({
          _id: new mongoose.Types.ObjectId(),
          author: user.username,
          timestamp: new Date(),
          body: req.body.article
        });

        return article.save();
      }
    })
    .then(article => {

      res.status(200).json({
        status: 200,
        message: 'post article success',
        data: {
          articleId: article._id,
          author: article.author,
          timestamp: article.timestamp,
          body: article.body
        }
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

module.exports = router;
