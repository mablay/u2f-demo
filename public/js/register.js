/* eslint-disable */
/* Get a registration request from the server, use it to register the key, send the results back
 * to server and check if it was successful
 */
function register () {
	ajaxGet('/api/register_request', function (authRequest) {
    const req = JSON.parse(authRequest)
    // req.attestation = 'direct'
    console.log('[register] received authRequest', req)
    // alert("Press your key")
    const regText = document.getElementById('regtext')
    regText.innerHTML = 'Press U2F Key!'
    u2f.register(APP_ID, [req], [], function(res) {
      regText.innerHTML = ''

      // console.log('[register] requesting /api/register')
      ajaxPost("/api/register", res, function(res) {
        if (res === 'true') {
          regText.innerHTML = 'Key registered!'
        } else {
          regText.innerHTML = JSON.stringify(res)
        }
      })
    })
  })
}
