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

  it('User Get by Id', function () {
    return expect(
      sdk.user.getById('test')
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

  it('User Get All', function () {
    return expect(
      sdk.user.getAll()
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

  it('User Login (Success)', function () {
    return expect(
      sdk.user.login('test', 'password')
        .then(user => user.username)
    ).to.eventually.equal('test');
  });

  it('User Login (Failed)', function () {
    return expect(
      sdk.user.login('test', 'wrong_password')
    ).to.eventually.be.rejectedWith(Error);
  });

  it('User Delete', function () {
    return expect(
      sdk.user.delete('test', 'password')
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

  it('User Get by Id again (should not be found)', function () {
    return expect(
      sdk.user.getById('test')
        .then(res => res.status)
    ).to.eventually.equal(400);
  });

  it('User Delete again (shoud not be found)', function () {
    return expect(
      sdk.user.delete('test', 'password')
        .then(res => res.status)
    ).to.eventually.equal(400);
  });

});
