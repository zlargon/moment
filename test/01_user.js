const fetch = require('node-fetch');
const sdk = require('../sdk/sdk.js');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

describe('User', function() {

  it('User Registration', function () {

    const username = 'test';
    const password = 'password';
    const email = 'test@gmail.com';

    return expect(
      sdk.user.register(username, password, email)
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

  it('User Get All', function () {
    return expect(
      sdk.user.getAll()
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

});
