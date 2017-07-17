import { loginUser, registerUser } from './resolvers/mutation/users';

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
	isExpired() {
		let token = this.getToken();
		let payload = token ? this.jwtHelper.decodeToken(token) : 0;
		return payload.activeUntil * 1000 < Date.now();
	}
	register(user) {
		if (user.password === user.passwordConfirm) {
			delete user.passwordConfirm;

			return new Promise(resolve => {
				registerUser({}, { data: user }).then(
					() => {
						this.toastService.simple(
							`Welcome ${user.firstName}! Please login now.`
						);
						return resolve();
					},
					err => this.toastService.error(err)
				);
			});
		} else {
			return this.toastService.simple('Passwords do not match');
		}
	}
	logIn(user) {
		let days = user.remember ? 14 : 1;
		const data = {
			username: user.username,
			password: user.password,
			days,
		};
		return new Promise(resolve => {
			loginUser({}, data).then(
				jwt => {
					this.saveToken(jwt);
					const payload = this.jwtHelper.decodeToken(jwt);
					this.toastService.simple(
						`Welcome back ${payload.firstName}!`
					);
					return resolve();
				},
				err => this.toastService.simple(err)
			);
		});
	}
	logOut() {
		return this.$window.localStorage.removeItem('token');
	}
	// activate(id) {
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: gql`
	// 				mutation activateUser($_id: String!) {
	// 					activateUser(_id: $_id)
	// 				}
	// 			`,
	// 			variables: {
	// 				_id: id,
	// 			},
	// 		})
	// 		.then(this.graphqlService.extract)
	// 		.then(
	// 			result => {
	// 				const jwt = result.activateUser;
	// 				this.saveToken(jwt);
	// 				const payload = this.jwtHelper.decodeToken(jwt);
	// 				this.toastService.simple(`Welcome ${payload.firstName}!`);
	// 				return;
	// 			},
	// 			err => this.graphqlService.error(err)
	// 		);
	// }
	// reset(email) {
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: gql`
	// 				mutation resetPasswordPrep(
	// 					$token: String!
	// 					$username: String!
	// 				) {
	// 					restricted(token: $token) {
	// 						resetPasswordPrep(username: $username)
	// 					}
	// 				}
	// 			`,
	// 			variables: {
	// 				token: this.getToken(),
	// 				username: email,
	// 			},
	// 		})
	// 		.then(this.graphqlService.extract)
	// 		.then(
	// 			result => {
	// 				this.toastService.simple(result.resetPasswordPrep);
	// 				return;
	// 			},
	// 			err => this.graphqlService.error(err)
	// 		);
	// }
	// resetPassword(email, id, password) {
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: gql`
	// 				mutation resetPassword(
	// 					$token: String!
	// 					$username: String!
	// 					$key: String!
	// 					$password: String!
	// 				) {
	// 					restricted(token: $token) {
	// 						resetPassword(
	// 							username: $username
	// 							key: $key
	// 							password: $password
	// 						)
	// 					}
	// 				}
	// 			`,
	// 			variables: {
	// 				token: this.getToken(),
	// 				username: email,
	// 				key: id,
	// 				password,
	// 			},
	// 		})
	// 		.then(this.graphqlService.extract)
	// 		.then(
	// 			result => {
	// 				this.toastService.simple(result.resetPassword);
	// 				return;
	// 			},
	// 			err => this.graphqlService.error(err)
	// 		);
	// }
	// updateAccount(user) {
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: updateUserMutation,
	// 			variables: {
	// 				token: this.getToken(),
	// 				data: user,
	// 			},
	// 		})
	// 		.then(this.graphqlService.extract)
	// 		.then(
	// 			result => {
	// 				const jwt = result.updateUser;
	// 				this.saveToken(jwt);
	// 				this.toastService.simple('Updated user');
	// 				return;
	// 			},
	// 			err => this.graphqlService.error(err)
	// 		);
	// }
	// changePassword(oldpass, newpass) {
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: updateUserMutation,
	// 			variables: {
	// 				token: this.getToken(),
	// 				data: { password: newpass, oldPassword: oldpass },
	// 			},
	// 		})
	// 		.then(this.graphqlService.extract)
	// 		.then(
	// 			result => {
	// 				const jwt = result.updateUser;
	// 				this.saveToken(jwt);
	// 				this.toastService.simple('Updated user');
	// 				return;
	// 			},
	// 			err => this.graphqlService.error(err)
	// 		);
	// }
}
