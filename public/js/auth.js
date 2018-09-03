/* eslint-disable */
/* Get an authentication request from the server,
 * sign it with the key, verify the results on the server
 */
function authenticate () {
  const authText = document.getElementById('authtext')
  jsonGet('/api/sign_request')
    .then(u2fKey => {
      if (u2fKey.error) throw new Error(u2fKey.error)
      authText.innerHTML = 'Press U2F Key!'
      return new Promise((resolve) => {
        u2f.sign(APP_ID, u2fKey.challenge, [u2fKey], resolve)
      })
    })
    .then(res => {
      const res2 = {...res}
      if (res2.clientData) res2.clientData = JSON.parse(window.atob(res2.clientData))
      document.getElementById('dSignRequest').innerHTML = JSON.stringify(res2, null, 4)
      return jsonPost('/api/authenticate', res)
    })
    .then(authResponse => {
      document.getElementById('dAuthenticate').innerHTML = JSON.stringify(authResponse, null, 4)
      if (authResponse.error) {
        authText.innerHTML = JSON.stringify(authResponse)
      } else {
        authText.innerHTML = authResponse.secretData.message
      }
    })
    .catch(err => {
      if (err.message === 'NO_KEY') {
        authText.innerHTML = 'The server doesn\'t know your key. <a id="registerLink" href="/">register</a> your key first!'
        document.getElementById('registerLink').focus()
      } else {
        console.error(err)
      }
    })
}
