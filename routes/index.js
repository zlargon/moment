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
  const token = shortid.generate();
  database.user_pw_tk[username] = {
    password_hash: password_hash,
    token: token
  };

  database.user_profile[token] = {
    username: username,
    article_id: []
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

  console.log(database);
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

router.get('/debug', function (req, res) {
  res.send(database);
});

module.exports = router;
