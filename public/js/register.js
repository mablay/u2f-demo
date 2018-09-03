/* eslint-disable */
/* Get a registration request from the server, use it to register the key, send the results back
 * to server and check if it was successful
 */
function register () {
  const regText = document.getElementById('regtext')
  jsonGet('/api/register_request')
    .then(registerRequest => {
      // registerRequest.attestation = 'direct'
      console.log('[register] received authRequest', registerRequest)
      // alert("Press your key")
      regText.innerHTML = 'Press U2F Key!'
      return new Promise((resolve) => {
        return u2f.register(APP_ID, [registerRequest], [], resolve)
      })
    })
    .then(res => {
      regText.innerHTML = ''
      // console.log('[register] requesting /api/register')
      return jsonPost('/api/register', res)
    })
    .then(res => {
      if (res === true) {
        regText.innerHTML = 'Key registered! You are ready to <a href="auth" id="authLink">Authenticate</a>'
        document.getElementById('authLink').focus()
      } else {
        regText.innerHTML = JSON.stringify(res)
      }
    })
    .catch(err => {
      console.error(err)
    })
}
