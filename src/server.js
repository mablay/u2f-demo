const express = require('express')
const fs = require('fs')
const https = require('https')
// const u2f = require('u2f')
const bodyParser = require('body-parser')
const u2fh = require('./u2f-handler')

// const { registrationChallengeHandler } = require('./src/register')

const app = express()
app.use(bodyParser.json())
app.use(require('cookie-parser')())
app.get('/', u2fh.getIndex)
app.get('/api/register_request', u2fh.registerRequest)
app.get('/api/sign_request', u2fh.signRequest)
app.post('/api/register', u2fh.register)
app.post('/api/authenticate', u2fh.authenticate)
app.use(express.static('public'))

// https server
const privateKey = fs.readFileSync('keystore/server.key', 'utf8')
const certificate = fs.readFileSync('keystore/server.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)

httpsServer.listen(8000)
// app.listen(3000, () => console.log('Example app listening on port 3000!'))
