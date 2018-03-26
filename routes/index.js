const express = require('express');
const router = express.Router();
const sha1 = require('js-sha1');
const shortid = require('shortid');

const mongoose = require('mongoose');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./public/index.html');
});

// Database
const database = {
  user_pw_tk: {},   // {
                    //   username: {
                    //     password: 'xxx',
                    //     token: 'xxx'
                    //   }
                    // }

  user_profile: {}, // {
                    //   user_token: {
                    //     username: 'xxx',
                    //     article_id: []
                    //   }
                    // }

  article: {}       // {
                    //   article_id: {
                    //     timestamp: '',
                    //     author: '',
                    //     content: ''
                    //   }
                    // }
};

// user login
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

// post article
router.post('/article', function (req, res) {
  const username = req.body.username;
  const user_token = req.body.token;
  const article_content = req.body.article;

  // verify the user and token
  const user = database.user_profile[user_token];
  if (typeof user === 'undefined' || user.username !== username) {
    res.status(400);
    res.send({
      status: 400,
      message: 'token is unauthorized',
      data: {
        username: username
      }
    });
    return;
  }

  const article_id = shortid.generate();
  database.article[article_id] = {
    time: new Date(),
    author: username,
    content: article_content
  };
  database.user_profile[user_token].article_id.push(article_id);

  res.status(200);
  res.send({
    status: 200,
    message: 'post success',
    data: {
      username: username,
      article_id: article_id
    }
  });
});

// get add article
router.get('/article', function (req, res) {
  const article_list = Object.values(database.article);

  res.status(200);
  res.send({
    status: 200,
    message: 'get articles success',
    data: {
      articles: article_list
    }
  });
});

// get article
router.get('/article/:username_or_articleid', function (req, res) {

  const id = req.params.username_or_articleid;

  // article is found
  if (typeof database.article[id] !== 'undefined') {
    res.status(200);
    res.send({
      status: 200,
      message: 'get article success',
      data: {
        article: database.article[id]
      }
    });
    return;
  }

  // username is found
  const user = database.user_pw_tk[id];
  if (typeof user !== 'undefined') {
    const article = database.user_profile[user.token].article_id.map(o => database.article[o]);
    res.status(200);
    res.send({
      status: 200,
      message: `get user's articles success`,
      data: {
        article: article
      }
    });
    return;
  }

  res.status(400);
  res.send({
    status: 400,
    message: 'username or article_id is not found',
    data: {}
  });
});

router.get('/debug', function (req, res) {
  User.find()
    .exec()
    .then(result => {
      res.send(result);
    })
    .catch(console.error);
});

module.exports = router;
