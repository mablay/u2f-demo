/* eslint-disable */
const APP_ID = 'https://localhost:8000'
/* Get an authentication request from the server,
 * sign it with the key, verify the results on the server
 */
function authenticate() {
	ajaxGet("/api/sign_request", function(authRequest) {
			var req = JSON.parse(authRequest);
			// console.log('[authenticate] sign_request responded with', req)
			// console.log("[authenticate] Press your key");
			const authText = document.getElementById('authtext')
			authText.innerHTML = 'Press U2F Key!'
			// alert('Press the button!')
			u2f.sign(APP_ID, req.challenge, [req], function(res) {
				// console.log('[authenticate] sign res', res);
				ajaxPost("/api/authenticate", res, function(res) {
					res = JSON.parse(res);
					if (res.error) {
						authText.innerHTML = JSON.stringify(res)
						// alert(res.error);
						return;
					} else {
						authText.innerHTML = JSON.stringify(res.secretData)
						// alert(JSON.stringify(res.secretData, true, 5));
					}
				});
			});
	});
}
/* Get a registration request from the server, use it to register the key, send the results back
 * to server and check if it was successful
 */
function register() {
	ajaxGet("/api/register_request", function(authRequest) {
			var req = JSON.parse(authRequest);
			// req.attestation = 'direct'
			// console.log('[register] received authRequest', req)
			// alert("Press your key");
			const regText = document.getElementById('regtext')
			regText.innerHTML = 'Press U2F Key!'
			u2f.register(APP_ID, [req], [], function(res) {
				regText.innerHTML = ''

				// console.log('[register] requesting /api/register');
				ajaxPost("/api/register", res, function(res) {
					if (res === "true") {
						regText.innerHTML = 'Key registered!'
					} else {
						regText.innerHTML = JSON.stringify(res)
					}
				});
			});
	});
}
/* Very basic ajax functions */
function ajaxGet(url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onload = function() {
		cb(xhr.responseText);
	};
	xhr.send();
}
function ajaxPost(url, data, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onload = function() {
		cb(xhr.responseText);
	};
	xhr.send(JSON.stringify(data));
}
