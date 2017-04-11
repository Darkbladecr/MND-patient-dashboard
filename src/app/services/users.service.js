import gql from 'graphql-tag';
import deleteUserMutation from '../graphql/admin/users/deleteUser.gql';
import editUserMutation from '../graphql/admin/users/editUser.gql';
import userQuery from '../graphql/admin/users/getUser.gql';
import usersQuery from '../graphql/admin/users/getUsers.gql';

export default class usersService {
	constructor(apollo, AuthService, jwtHelper, toastService, graphqlService) {
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.jwtHelper = jwtHelper;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	getUsers(search) {
		return this.apollo.query({
				query: usersQuery,
				variables: {
					token: this.AuthService.getToken(),
					search: search.text,
					accessLevel: search.accessLevel
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.users;
			}, err => this.graphqlService.error(err));
	}
	getById(userId) {
		return this.apollo.query({
				query: userQuery,
				variables: {
					token: this.AuthService.getToken(),
					_id: userId
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.user;
			}, err => this.graphqlService.error(err));
	}
	updateUser(user) {
		let _id = user._id;
		delete user._id;
		return this.apollo.mutate({
				mutation: editUserMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: _id,
					userData: user
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('User updated');
				const decoded = this.jwtHelper.decodeToken(result.updateUser);
				const updatedUser = {
					_id: decoded._id,
					firstName: decoded.firstName,
					lastName: decoded.lastName,
					username: decoded.username,
					accessLevel: decoded.accessLevel
				};
				return updatedUser;
			}, err => this.graphqlService.error(err));
	}
	deleteUser(userId) {
		return this.apollo.mutate({
				mutation: deleteUserMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: userId
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return this.toastService.simple(result.deleteUser);
			}, err => this.graphqlService.error(err));
	}
}
