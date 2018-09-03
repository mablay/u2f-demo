const port = 8001
module.exports = {
  port,
  // The app ID is a string used to uniquely identify your U2F app, for both registration requests and
  // authentication requests. It is usually the fully qualified URL of your website. The website MUST
  // be HTTPS, otherwise the registration will fail client-side.
  APP_ID: 'https://localhost:' + port
}
