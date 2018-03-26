const fetch = require('node-fetch');
const sdk = require('../sdk/sdk.js');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

const USER = {
  username: 'test',
  password: 'password',
  email: 'test@gmail.com',
  token: ''
};

let UESR_NUMBER;

describe('User', function() {

  it('User Get All (before registration)', function () {
    return expect(
      sdk.user.getAll()
        .then(users => {
          UESR_NUMBER = users.length;

          return Array.isArray(users);
        })
    ).to.eventually.equal(true);
  });

  it('User Registration', function () {
    return expect(
      sdk.user.register(USER.username, USER.password, USER.email)
        .then(user => {
          USER.token = user.token;  // get token

          return (user.username === USER.username) && (user.email === USER.email)
        })
    ).to.eventually.equal(true);
  });

  it('User Get All (after registration)', function () {
    return expect(
      sdk.user.getAll()
        .then(users => {
          return UESR_NUMBER = users.length;
        })
    ).to.eventually.equal(UESR_NUMBER + 1);
  });

  it('User Login (Failed)', function () {
    return expect(
      sdk.user.login(USER.username, 'wrong_password')
    ).to.eventually.be.rejected;
  });

  it('User Login (Success)', function () {
    return expect(
      sdk.user.login(USER.username, USER.password)
        .then(user => {
          return (user.username === USER.username) && (user.token === USER.token)
        })
    ).to.eventually.equal(true);
  });

  it('User Get by Id', function () {
    return expect(
      sdk.user.getById(USER.username)
        .then(res => res.status)
    ).to.eventually.equal(200);
  });

  it('User Delete', function () {
    return expect(
      sdk.user.delete('test', 'password')
        .then(user => {
          return user.username === USER.username
        })
    ).to.eventually.equal(true);
  });

  it('User Get by Id again (should not be found)', function () {
    return expect(
      sdk.user.getById(USER.username)
        .then(res => res.status)
    ).to.eventually.equal(400);
  });

  it('User Delete again (shoud not be found)', function () {
    return expect(
      sdk.user.delete('test', 'password')
    ).to.eventually.be.rejected;
  });

});
