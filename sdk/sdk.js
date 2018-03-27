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
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    getById: function (username, token) {
      return fetch(`${host}/user/${username}?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    getAll: function () {
      return fetch(`${host}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    delete: function (username, password) {
      return fetch(`${host}/user`, {
        method: 'DELETE',
        body: JSON.stringify({
          username: username,
          password: sha1(password)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    login: function (username, password) {
      return fetch(`${host}/auth?username=${username}&password=${sha1(password)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    }
  },

  article: {
    post: function (username, token, article) {
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
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    getAll: function() {
      return fetch(`${host}/article`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    getById: function(articleId) {
      return fetch(`${host}/article/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },

    deleteById: function (username, token, articleId) {
      return fetch(`${host}/article/${articleId}`, {
        method: 'DELETE',
        body: JSON.stringify({
          username: username,
          token: token
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.status !== 200) {
          throw new Error(result.message);
        }
        return result.data;
      });
    },
  }
}

module.exports = sdk;
