/* eslint-disable */
/**
A Yubico OTP is a 44-character, one use, secure, 128-bit encrypted
Public ID and Password, near impossible to spoof. The OTP is comprised
of two major parts: the first 12 characters remain constant and represent
the Public ID of the YubiKey device itself. The remaining 32 characters
make up a unique passcode for each OTP generated.
*/
function verify () {
  const otp = document.getElementById('otp').value
  document.getElementById('otptext').innerHTML = 'OPT verification not implemented!'
  console.log('OTP', otp)
  jsonPost('/api/verify', {otp})
  .then(res => {
    dVerify.innerHTML = JSON.stringify(res, null, 4)
    console.log('OTP verify response:', res)
  })
  .catch(console.error)
}
