const fetch = require('node-fetch');
const sdk = require('../sdk/sdk.js');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

const USER = {
  username: 'test_article',
  password: 'password',
  token: ''
};

const ARTICLE = 'Hello World!';

describe('User', function() {

  before(function (done) {
    sdk.user.login(USER.username, USER.password)
      .then(user => {
        USER.token = user.token;
        done();
      })
  });

  it('Post Article', function () {
    return expect(
      sdk.article.post(USER.username, USER.token, ARTICLE)
        .then(article => {
          return (article.author === USER.username) && (article.body === ARTICLE)
        })
    ).to.eventually.equal(true);
  });
});
