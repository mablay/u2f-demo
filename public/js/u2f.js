/* eslint-disable */

const APP_ID = window.location.origin
console.log(`Using "${APP_ID}" as APP_ID. This must equal the APP_ID provided in the nodejs logs.`)
const appid = document.getElementById('appid')
appid.innerHTML = `APP_ID: "${APP_ID}"`

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
