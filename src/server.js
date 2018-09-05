const express = require('express')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const u2fh = require('./u2f-handler')
const Path = require('path')
const { port, APP_ID } = require('./constants')

const router = (view, data) => (req, res, next) => {
  if (!req.cookies.userid) {
    res.cookie('userid', Math.floor(Math.random() * 100000))
  }
  res.render('layout', { view, data })
}

const app = express()
app.set('views', Path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.set('layout', 'layout2')
app.use(bodyParser.json())
app.use(require('cookie-parser')())
app.get('/', router('index'))
app.get('/auth', router('auth'))
app.get('/otp', router('otp'))
app.get('/api/register_request', u2fh.registerRequest)
app.get('/api/sign_request', u2fh.signRequest)
app.post('/api/register', u2fh.register)
app.post('/api/authenticate', u2fh.authenticate)
app.post('/api/verify', u2fh.verifyOtp)
app.use(express.static('public'))

// https server
const privateKey = fs.readFileSync('keystore/server.key', 'utf8')
const certificate = fs.readFileSync('keystore/server.crt', 'utf8')
const credentials = { key: privateKey, cert: certificate }
const httpsServer = https.createServer(credentials, app)

httpsServer.listen(port, () => {
  console.log(`Open exactly ${APP_ID}" which must be displayed as APP_ID in the browser.`)
  console.log('Make sure that `keystore/server.crt` has been added to your keychain and is marked as "trusted"!')
})
