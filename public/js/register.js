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
      const res2 = {...res}
      if (res2.clientData) res2.clientData = JSON.parse(window.atob(res2.clientData))
      document.getElementById('dRegisterRequest').innerHTML = JSON.stringify(res2, null, 4)
      // console.log('[register] requesting /api/register')
      return jsonPost('/api/register', res)
    })
    .then(res => {
      if (res.certificate) res.certificate.data = '[...]'
      document.getElementById('dRegister').innerHTML = JSON.stringify(res, null, 4)
      if (res.successful === true) {
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
