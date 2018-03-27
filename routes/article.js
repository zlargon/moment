const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/UserModel');
const Article = require('../models/ArticleModel');

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

        // 1. create article
        const articleId = new mongoose.Types.ObjectId();
        const article = new Article({
          _id: articleId,
          author: user.username,
          timestamp: new Date(),
          body: req.body.article
        });

        // 2. add article id to user
        user.article.push(articleId);

        return Promise.all([
          article.save(),
          user.save()
        ]);
      }
    })
    .then(result => {

      const article = result[0];
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

// 4. delete article
router.delete('/:articleId', function (req, res) {

  // 1. check user auth
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

        // 2. remove article from user.article array
        const articleId = req.params.articleId;
        const index = user.article.indexOf(articleId);
        if (index !== -1) {
          user.article.splice(index, 1);
        }

        // 3. find the article
        return Promise.all([
          Article.findOneAndRemove({ author: user.username, _id: req.params.articleId }),
          user.save()
        ]);
      }

    })
    .then(result => {

      const article = result[0];
      if (!article) {

        res.status(400).json({
          status: 400,
          message: 'article is not found',
          data: {}
        });

      } else {

        res.status(200).json({
          status: 200,
          message: 'article delete success',
          data: {
            articleId: article._id
          }
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
