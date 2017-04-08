import loginUserMutation from '../graphql/auth/loginUser.gql';
import profileQuery from '../graphql/auth/profile.gql';
import registerUserMutation from '../graphql/auth/registerUser.gql';
import resetPasswordMutation from '../graphql/auth/resetPassword.gql';
import resetPasswordPrepMutation from '../graphql/auth/resetPasswordPrep.gql';
import updateUserMutation from '../graphql/auth/updateUser.gql';
import gql from 'graphql-tag';

export default class AuthService {
	constructor($ngRedux, AuthActions, $window, jwtHelper, apollo, toastService, graphqlService) {
		'ngInject';
		this.store = $ngRedux;
		this.AuthActions = AuthActions;
		this.$window = $window;
		this.jwtHelper = jwtHelper;
		this.apollo = apollo;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	saveToken(jwt) {
		this.$window.localStorage.token = jwt;
		this.store.dispatch(this.AuthActions.updateJWT(this.jwtHelper.decodeToken(jwt)));
	}
	getToken() {
		return this.$window.localStorage.token;
	}
	getTokenDecoded() {
		const { user } = this.store.getState();
		return user;
	}
	currentUser() {
		return this.getTokenDecoded();
	}
	getUserID() {
		let payload = this.getTokenDecoded();
		return payload._id;
	}
	getAccessLevel() {
		let token = this.getToken();
		let payload = token ? this.jwtHelper.decodeToken(token) : null;
		return payload.accessLevel;
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
	profile() {
		let _id = this.getUserID();
		return this.apollo.query({
				query: profileQuery,
				variables: {
					token: this.getToken(),
					_id: _id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.resticted.user);
				return;
			}, err => this.graphqlService.error(err));
	}
	register(user) {
		if (user.password === user.passwordConfirm) {
			delete user.passwordConfirm;

			return this.apollo.mutate({
					mutation: registerUserMutation,
					variables: {
						user: user
					}
				})
				.then(this.graphqlService.extract)
				.then(result => {
					return this.toastService.simple(`Welcome ${result.registerUser.firstName}! Check your email to activate your account.`);
					// return result.registerUser;
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
		})

	}
	registerStripeToken(token) {
		return this.apollo.mutate({
				mutation: gql `mutation registerStripeToken($token: Token!){
				registerStripeToken(token:$token){
					_id
				}
			}`,
				variables: {
					token
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.registerStripeToken;
			}, err => this.graphqlService.error(err));
	}
	logIn(user) {
		let days = user.remember ? 14 : 1;
		return this.apollo.mutate({
				mutation: loginUserMutation,
				variables: {
					username: user.username,
					password: user.password,
					days
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const jwt = result.loginUser;
				this.$window.localStorage.token = jwt;
				const decoded = this.jwtHelper.decodeToken(jwt);
				this.store.dispatch(this.AuthActions.logIn(decoded));
				this.toastService.simple(`Welcome back ${decoded.firstName}!`);
				return;
			}, err => this.graphqlService.error(err));
	}
	logOut() {
		this.$window.localStorage.removeItem('token');
		this.store.dispatch(this.AuthActions.logOut());
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
