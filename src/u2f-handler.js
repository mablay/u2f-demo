const u2f = require('u2f')
const modhex = require('modhex')
const { APP_ID } = require('./constants')
const secretMessage = require('../data/secure.json')
// const Path = require('path')
const Sessions = {}
const Users = {}

// GET /
// function getIndex (req, res) {
//   if (!req.cookies.userid) {
//     res.cookie('userid', Math.floor(Math.random() * 100000))
//   }
//   res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'))
// }

// /api/register_request
function registerRequest (req, res) {
  // console.log('[registerRequest], APP_ID:', APP_ID)
  var authRequest = u2f.request(APP_ID)
  // console.log('[registerRequest], authRequest:', authRequest)
  Sessions[req.cookies.userid] = { authRequest: authRequest }
  res.json(authRequest)
}

// /api/sign_request
function signRequest (req, res) {
  if (!req.cookies.userid || !Users[req.cookies.userid]) {
    console.log('Client cookies indicate no registered U2F key.')
    return res.json({ error: 'NO_KEY' })
  }
  var authRequest = u2f.request(APP_ID, Users[req.cookies.userid].keyHandle)
  Sessions[req.cookies.userid] = { authRequest: authRequest }
  res.json(authRequest)
}

// /api/register
function register (req, res) {
  // console.log('[register] body:', req.body)
  const authRequest = Sessions[req.cookies.userid].authRequest
  // console.log('[session] authRequest', authRequest)
  var checkRes = u2f.checkRegistration(authRequest, req.body)
  // console.log(checkRes)
  console.log('[register] Key registration:', checkRes)
  if (checkRes.successful) {
    Users[req.cookies.userid] = { publicKey: checkRes.publicKey, keyHandle: checkRes.keyHandle }
    if (checkRes.certificate) checkRes.certificate = checkRes.certificate.toString('hex')
    res.json(checkRes)
  } else {
    res.json(checkRes.errorMessage)
  }
}

// POST /api/authenticate
function authenticate (req, res) {
  // console.log(req.body)
  var checkRes = u2f.checkSignature(
    Sessions[req.cookies.userid].authRequest,
    req.body,
    Users[req.cookies.userid].publicKey
  )
  // console.log(checkRes)
  console.log('[authenticate] Key authentication:', checkRes)

  if (checkRes.successful) {
    res.json({ success: true, secretData: secretMessage })
  } else {
    res.json({ error: checkRes.errorMessage })
  }
}

// POST /api/verify
function verifyOtp (req, res) {
  if (!req.body.otp) {
    return res.json({ error: 'Missing "otp" property!' })
  }
  const otp = modhex.decode(req.body.otp)
  const keyId = parseInt(otp.substring(0, 12), 16)
  const encryptedPasscode = otp.substring(12)
  // console.log('[verifyOtp] otp:', otp)
  console.log('[verifyOtp] keyId:', keyId)
  console.log('[verifyOtp] encryptedPasscode:', encryptedPasscode)
  res.json({
    keyId,
    encryptedPasscode
  })
}

module.exports = {
  registerRequest,
  signRequest,
  register,
  authenticate,
  verifyOtp
}
