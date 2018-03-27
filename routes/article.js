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

// 2. get all article
router.get('/', function (req, res) {

  Article.find()
    .exec()
    .then(articles => {
      res.status(200).json({
        status: 200,
        message: 'get all articles success',
        data: articles.map(o => {
          return {
            articleId: o._id,
            author: o.author,
            timestamp: o.timestamp,
            body: o.body,
            comment: o.comment
          }
        })
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

// 3. get article by id
router.get('/:articleId', function (req, res) {
  Article.findOne({
      _id: req.params.articleId
    })
    .exec()
    .then(article => {

      // failed
      if (!article) {
        res.status(400).json({
          status: 400,
          message: 'article is not found',
          data: {}
        });
        return;
      }

      // success
      res.status(200).json({
        status: 200,
        message: 'get article profile success',
        data: {
          author: article.author,
          timestamp: article.timestamp,
          body: article.body,
          comment: article.comment
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
