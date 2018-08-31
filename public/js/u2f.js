/* eslint-disable */
const APP_ID = 'https://localhost:8000'
/* Get an authentication request from the server,
 * sign it with the key, verify the results on the server
 */
function authenticate() {
	ajaxGet("/api/sign_request", function(authRequest) {
			var req = JSON.parse(authRequest);
			// delete req.version
			console.log('[authenticate] sign_request responded with', req)
			console.log("[authenticate] Press your key");
			// alert('Press the button!')
			u2f.sign(APP_ID, req.challenge, [req], function(res) {
				console.log('[authenticate] sign res', res);
				ajaxPost("/api/authenticate", res, function(res) {
					res = JSON.parse(res);
					if (res.error) {
						alert(res.error);
						return;
					} else {
						alert(JSON.stringify(res.secretData, true, 5));
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
			console.log('[register] received authRequest', req)
			// alert("Press your key");
			console.log('PRESS KEY NOW!')
			u2f.register(APP_ID, [req], [], function(res) {
				console.log('[register] requesting /api/register');
				ajaxPost("/api/register", res, function(res) {
					if (res === "true") {
						alert("Successfully registered that key. You can now view student data.");
					} else {
						alert(res);
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
