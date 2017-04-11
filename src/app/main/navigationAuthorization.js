import jwtDecode from 'jwt-decode';

function authorized() {
	let token = window.localStorage.token;
	let payload = token ? jwtDecode(token) : null;
	let loggedIn = payload ? payload.exp > (performance.timing.navigationStart + performance.now()) / 1000 : false;
	return loggedIn ? false : true;
}

export { authorized };
