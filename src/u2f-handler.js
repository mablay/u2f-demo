var u2f = require('u2f')
const { APP_ID } = require('./constants')
var secretMessage = require('../data/secure.json')
// const fs = require('fs')
const Path = require('path')
var Sessions = {}
var Users = {}

// GET /
function getIndex (req, res) {
  if (!req.cookies.userid) {
    res.cookie('userid', Math.floor(Math.random() * 100000))
  }
  res.sendFile(Path.join(__dirname, '..', 'public', 'index.html'))
}

// /api/register_request
function registerRequest (req, res) {
  // console.log('[registerRequest], APP_ID:', APP_ID)
  var authRequest = u2f.request(APP_ID)
  // console.log('[registerRequest], authRequest:', authRequest)
  Sessions[req.cookies.userid] = { authRequest: authRequest }
  res.send(JSON.stringify(authRequest))
}

// /api/sign_request
function signRequest (req, res) {
  var authRequest = u2f.request(APP_ID, Users[req.cookies.userid].keyHandle)
  Sessions[req.cookies.userid] = { authRequest: authRequest }
  res.send(JSON.stringify(authRequest))
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
    res.send(true)
  } else {
    res.send(checkRes.errorMessage)
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
    res.send({ success: true, secretData: secretMessage })
  } else {
    res.send({ error: checkRes.errorMessage })
  }
}

module.exports = {
  getIndex,
  registerRequest,
  signRequest,
  register,
  authenticate
}
