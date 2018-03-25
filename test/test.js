const co = require('co');
const fetch = require('node-fetch');
const sha1 = require('js-sha1');
const host = 'http://localhost:3000';

// Register
function register (username, password) {
  return fetch(`${host}/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password_hash: sha1(password)
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

// Login
function login (username, password) {
  return fetch(`${host}/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password_hash: sha1(password)
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

// Post Article
function post (username, token, article) {
  return fetch(`${host}/article`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      token: token,
      article: article
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

// Get all articles
function get_all_article () {
  return fetch(`${host}/article`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

function get_article_by_id (article_id) {
  return fetch(`${host}/article/${article_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

function get_article_by_username (username) {
  return fetch(`${host}/article/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json());
}

// Test
co(function * () {

  let res = yield register('leon_huang', 'password');
  if (res.status !== 200) {
    console.log(res.message);
  }

  res = yield login('leon_huang', 'password');
  if (res.status !== 200) {
    throw new Error(res.message);
  }

  const token = res.data.token;
  res = yield post('leon_huang', token, 'Hello World!!')
  if (res.status !== 200) {
    throw new Error(res.message);
  }
  const article_id = res.data.article_id;

  // get article
  res = yield get_all_article();
  if (res.status !== 200) {
    throw new Error(res.message);
  }
  console.log('ALL ARTICLES:');
  console.log(res.data.articles);
  console.log('');


  console.log(`USER'S ARTICLES:`);
  res = yield get_article_by_username('leon_huang');
  if (res.status !== 200) {
    throw new Error(res.message);
  }
  console.log(res.data.article);


  console.log('');
  console.log(`ARTICLE ${article_id}:`);
  res = yield get_article_by_id(article_id);
  if (res.status !== 200) {
    throw new Error(res.message);
  }
  console.log(res.data.article);
})
.catch(console.error);
