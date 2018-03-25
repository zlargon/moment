const host = 'http://localhost:3000';

// Register
function register (username, password) {
  fetch(`${host}/register`, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: sha1(password)
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res => res.json())
  .then(res => {
    if (res.status !== 200) {
      throw new Error(res.message);
    }
    return res.data;
  })
  .then(console.log)
  .catch(console.error);
}
