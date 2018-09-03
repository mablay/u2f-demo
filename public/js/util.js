/* eslint-disable */

const APP_ID = window.location.origin
console.log(`Using "${APP_ID}" as APP_ID. This must equal the APP_ID provided in the nodejs logs.`)
document.getElementById('appid').innerHTML = `APP_ID: "${APP_ID}"`

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
