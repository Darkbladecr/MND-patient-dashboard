import resetPasswordMutation from '../graphql/auth/resetPassword.gql';
import resetPasswordPrepMutation from '../graphql/auth/resetPasswordPrep.gql';
import updateUserMutation from '../graphql/auth/updateUser.gql';
import gql from 'graphql-tag';

export default class AuthService {
	constructor($window, jwtHelper, apollo, toastService, graphqlService) {
		'ngInject';
		this.$window = $window;
		this.jwtHelper = jwtHelper;
		this.apollo = apollo;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	saveToken(jwt) {
		this.$window.localStorage.token = jwt;
	}
	getToken() {
		return this.$window.localStorage.token;
	}
	getTokenDecoded() {
		return this.jwtHelper.decodeToken(this.getToken());
	}
	currentUser() {
		return this.getTokenDecoded();
	}
	getUserID() {
		let payload = this.getTokenDecoded();
		return payload._id;
	}
	isLoggedIn() {
		let token = this.getToken();
		return token ? !this.jwtHelper.isTokenExpired(token) : false;
	}
	isExpired(){
		let token = this.getToken();
		let payload = token ? this.jwtHelper.decodeToken(token) : 0;
		return payload.activeUntil * 1000 < Date.now();
	}
	register(user) {
		if (user.password === user.passwordConfirm) {
			delete user.passwordConfirm;

			return this.apollo.mutate({
					mutation: gql`mutation registerUser($user:RegisterUser!){
					    registerUser(data:$user)
					}`,
					variables: {
						user: user
					}
				})
				.then(this.graphqlService.extract)
				.then(result => {
					this.toastService.simple(`Welcome ${result.registerUser.firstName}! Please login now.`);
					return result.registerUser;
				}, err => this.graphqlService.error(err));
		} else {
			return this.toastService.simple('Passwords do not match');
		}
	}
	usernameAvailable(username) {
		return new Promise((resolve) => {
			return this.apollo.query({
					query: gql `query usernameAvailable($username: String!){
						usernameAvailable(username:$username)
					}`,
					variables: {
						username
					},
					fetchPolicy: 'network-only'
				})
				.then(this.graphqlService.extract)
				.then(result => result.usernameAvailable ? resolve(true) : resolve(false));
		});
	}
	logIn(user) {
		let days = user.remember ? 14 : 1;
		return this.apollo.mutate({
				mutation: gql`mutation login($username: String!, $password: String!, $days:Int!){
				    loginUser(username:$username, password:$password, days:$days)
				}`,
				variables: {
					username: user.username,
					password: user.password,
					days
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const jwt = result.loginUser;
				this.saveToken(jwt);
				const decoded = this.jwtHelper.decodeToken(jwt);
				this.toastService.simple(`Welcome back ${decoded.firstName}!`);
				return;
			}, err => this.graphqlService.error(err));
	}
	logOut() {
		return this.$window.localStorage.removeItem('token');
	}
	activate(id) {
		return this.apollo.mutate({
				mutation: gql `mutation activateUser($_id:String!){
					activateUser(_id:$_id)
				}`,
				variables: {
					_id: id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const jwt = result.activateUser;
				this.saveToken(jwt);
				const payload = this.jwtHelper.decodeToken(jwt);
				this.toastService.simple(`Welcome ${payload.firstName}!`);
				return;
			}, err => this.graphqlService.error(err));
	}
	reset(email) {
		return this.apollo.mutate({
				mutation: resetPasswordPrepMutation,
				variables: {
					token: this.getToken(),
					username: email
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.resetPasswordPrep);
				return;
			}, err => this.graphqlService.error(err));
	}
	resetPassword(email, id, password) {
		return this.apollo.mutate({
				mutation: resetPasswordMutation,
				variables: {
					token: this.getToken(),
					username: email,
					key: id,
					password
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.resetPassword);
				return;
			}, err => this.graphqlService.error(err));
	}
	updateAccount(user) {
		return this.apollo.mutate({
				mutation: updateUserMutation,
				variables: {
					token: this.getToken(),
					data: user
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const jwt = result.updateUser;
				this.saveToken(jwt);
				this.toastService.simple('Updated user');
				return;
			}, err => this.graphqlService.error(err));
	}
	changePassword(oldpass, newpass) {
		return this.apollo.mutate({
				mutation: updateUserMutation,
				variables: {
					token: this.getToken(),
					data: { password: newpass, oldPassword: oldpass }
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const jwt = result.updateUser;
				this.saveToken(jwt);
				this.toastService.simple('Updated user');
				return;
			}, err => this.graphqlService.error(err));
	}
}
