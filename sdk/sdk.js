const co = require('co');
const fetch = require('node-fetch');
const sha1 = require('js-sha1');
const host = 'http://localhost:3000';

// Register
const sdk = {
  user: {
    register: function (username, password, email) {
      return fetch(`${host}/user`, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: sha1(password),
          email: email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json());
    }
  }
}

module.exports = sdk;
