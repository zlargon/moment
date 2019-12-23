const sdk = require('../src/sdk');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

describe('Article', () => {

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

  before(async () => {
    const user = await sdk.user.login(USER.username, USER.password);
    USER.token = user.token;

    const articles = await sdk.article.getAll();
    ARTICLE.number = articles.length;
  });

  it('Article Post', async () => {
    const article = await sdk.article.post(USER.username, USER.token, ARTICLE.body);
    ARTICLE.id = article.articleId;

    expect(article.author).to.equal(USER.username);
    expect(article.body).to.equal(ARTICLE.body);
  });

  it('Article Get All', async () => {
    const articles = await sdk.article.getAll();
    expect(articles.length).to.equal(ARTICLE.number + 1);
  });

  it('Article Get by Id', async () => {
    const article = await sdk.article.getById(ARTICLE.id);
    expect(article.author).to.equal(USER.username);
    expect(article.body).to.equal(ARTICLE.body);
  });

  it('Article delete by Id', async () => {
    const article = await sdk.article.deleteById(USER.username, USER.token, ARTICLE.id);
    expect(article.articleId).to.equal(ARTICLE.id);
  });

  it('Article get by id again (should be failed)', async () => {
    expect(
      sdk.article.getById(ARTICLE.id)
    ).to.be.rejectedWith(Error);
  });

  it('Article delete by id again (should be failed)', async () => {
    expect(
      sdk.article.deleteById(USER.username, USER.token, ARTICLE.id)
    ).to.be.rejectedWith(Error);
  });
});
