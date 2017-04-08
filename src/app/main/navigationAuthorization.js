import jwtDecode from 'jwt-decode';

function authorized() {
	let token = window.localStorage.token;
	let payload = token ? jwtDecode(token) : null;
	let loggedIn = payload ? payload.exp > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	let expired = loggedIn ? payload.activeUntil > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	return expired ? false : true;
}

function authorizedExpired() {
	let token = window.localStorage.token;
	let payload = token ? jwtDecode(token) : null;
	let loggedIn = payload ? payload.exp > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	let expired = loggedIn ? payload.activeUntil < (performance.timing.navigationStart + performance.now()) / 1000 : false;
	return expired ? false : true;
}

function notAuthorized(){
	return !authorized();
}

function authorizedAuthor(){
	let token = window.localStorage.token;
	let payload = token ? jwtDecode(token) : null;
	let loggedIn = payload ? payload.exp > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	let expired = loggedIn ? payload.activeUntil > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	return expired ? !['administrator', 'author'].includes(payload.accessLevel) : true;
}

function authorizedAdmin() {
	let token = window.localStorage.token;
	let payload = token ? jwtDecode(token) : null;
	let loggedIn = payload ? payload.exp > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	let expired = loggedIn ? payload.activeUntil > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	return expired ? payload.accessLevel !== 'administrator' : true;
}

export { authorized, authorizedExpired, notAuthorized, authorizedAuthor, authorizedAdmin };
