const fetch = require('node-fetch');
const sdk = require('../src/sdk');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

const USER = {
  username: 'test_article',
  password: 'password',
  token: ''
};

const ARTICLE = {
  body: 'Hello World!',
  number: -1,
  id: ''
};

describe('Article', function() {

  before(function (done) {
    sdk.user.login(USER.username, USER.password)
      .then(user => {
        USER.token = user.token;

        return sdk.article.getAll()
      })
      .then(articles => {
        ARTICLE.number = articles.length;
        done();
      });
  });

  it('Article Post', function () {
    return expect(
      sdk.article.post(USER.username, USER.token, ARTICLE.body)
        .then(article => {
          ARTICLE.id = article.articleId;

          return (article.author === USER.username) && (article.body === ARTICLE.body)
        })
    ).to.eventually.equal(true);
  });

  it('Article Get All', function () {
    return expect(
      sdk.article.getAll()
        .then(articles => {
          return articles.length;
        })
    ).to.eventually.equal(ARTICLE.number + 1);
  });

  it('Article Get by Id', function () {
    return expect(
      sdk.article.getById(ARTICLE.id)
        .then(article => {
          return (article.author === USER.username) && (article.body === ARTICLE.body);
        })
    ).to.eventually.equal(true);
  });

  it('Article delete by Id', function () {
    return expect(
      sdk.article.deleteById(USER.username, USER.token, ARTICLE.id)
        .then(article => {
          return article.articleId === ARTICLE.id;
        })
    ).to.eventually.equal(true);
  });

  it('Article get by id again (should be failed)', function () {
    return expect(
      sdk.article.getById(ARTICLE.id)
    ).to.eventually.be.rejected;
  });

  it('Article delete by id again (should be failed)', function () {
    return expect(
      sdk.article.deleteById(USER.username, USER.token, ARTICLE.id)
    ).to.eventually.be.rejected;
  });
});
