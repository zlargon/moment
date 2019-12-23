const sdk = require('../src/sdk');
const chai = require('chai');
const expect = chai.expect;

// setup promise
chai.use(require('chai-as-promised'));

describe('User', () => {
  let UESR_NUMBER;
  const USER = {
    username: 'test',
    password: 'password',
    email: 'test@gmail.com',
    token: ''
  };

  before(async () => {
    const users = await sdk.user.getAll();
    UESR_NUMBER = users.length;
  });

  it('User Registration', async () => {
    const user = await sdk.user.register(USER.username, USER.password, USER.email);
    USER.token = user.token;

    expect(user.username).to.equal(USER.username);
    expect(user.email).to.equal(USER.email);
  });

  it('User Get All (after registration)', async () => {
    const users = await sdk.user.getAll();
    expect(users.length).to.equal(UESR_NUMBER + 1);
  });

  it('User Login (Failed)', async () => {
    expect(
      sdk.user.login(USER.username, 'wrong_password')
    ).to.be.rejectedWith(Error);
  });

  it('User Login (Success)', async () => {
    const user = await sdk.user.login(USER.username, USER.password);
    expect(user.username).to.equal(USER.username);
    expect(user.email).to.equal(USER.email);
  });

  it('User Get by Id', async () => {
    const user = await sdk.user.getById(USER.username, USER.token);
    expect(user.username).to.equal(USER.username);
    expect(user.email).to.equal(USER.email);
  });

  it('User Delete', async () => {
    const user = await sdk.user.delete(USER.username, USER.password);
    expect(user.username).to.equal(USER.username);
  });

  it('User Get by Id again (should not be found)', async () => {
    expect(
      sdk.user.getById(USER.username, USER.token)
    ).to.be.rejectedWith(Error);
  });

  it('User Delete again (shoud not be found)', async () => {
    expect(
      sdk.user.delete('test', 'password')
    ).to.be.rejectedWith(Error);
  });

});
