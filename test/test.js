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
  .then(res => res.json())
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
  .then(res => res.json())
}

// Login
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
  .then(res => res.json())
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

  return res;
})
.then(console.log)
.catch(console.error);
