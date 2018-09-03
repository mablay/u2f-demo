/* eslint-disable */
/* Get an authentication request from the server,
 * sign it with the key, verify the results on the server
 */
function authenticate () {
  const authText = document.getElementById('authtext')
  fetch('/api/sign_request')
    .then(response => response.json())
    .then(u2fKey => {
      if (u2fKey.error === 'NO_KEY') {
        throw new Error(u2fKey.error)
      }
      // console.log('[authenticate] sign_request responded with', u2fKey)
      authText.innerHTML = 'Press U2F Key!'
      return new Promise((resolve) => {
        u2f.sign(APP_ID, u2fKey.challenge, [u2fKey], resolve)
      })
    })
    .then(res => {
      return fetch('/api/authenticate', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(res)
      })
    })
    .then(authResponse => authResponse.json())
    .then(authResponse => {
      if (authResponse.error) {
        authText.innerHTML = JSON.stringify(authResponse)
      } else {
        authText.innerHTML = JSON.stringify(authResponse.secretData)
      }
    })
    .catch(err => {
      if (err.message === 'NO_KEY') {
        authText.innerHTML = 'The server doesn\'t know your key. <a href="/">register</a> your key first!'
      } else {
        console.error(err)
      }
    })
}
