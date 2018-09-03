/* eslint-disable */

const APP_ID = window.location.origin
console.log(`Using "${APP_ID}" as APP_ID. This must equal the APP_ID provided in the nodejs logs.`)
const appid = document.getElementById('appid')
appid.innerHTML = `APP_ID: "${APP_ID}"`

function jsonGet(url) {
	return fetch(url).then(res => res.json())
}

function jsonPost(url, data = {}) {
	return fetch(url, {
		method: 'POST',
		headers: {
				"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(data)
	})
	.then(res => res.json())
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
