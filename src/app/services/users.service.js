import gql from 'graphql-tag';
import accessLevelMutation from '../graphql/admin/users/editAccessLevel.gql';
import deleteUserMutation from '../graphql/admin/users/deleteUser.gql';
import editUserMutation from '../graphql/admin/users/editUser.gql';
import userQuery from '../graphql/admin/users/getUser.gql';
import getSelf from '../graphql/restricted/getUser.gql';
import usersQuery from '../graphql/admin/users/getUsers.gql';
import getDashboard from '../graphql/restricted/getDashboard.gql';

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
	getSelf() {
		return this.apollo.query({
				query: getSelf,
				variables: {
					token: this.AuthService.getToken()
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.user;
			}, err => this.graphqlService.error(err));
	}
	getDashboard() {
		return this.apollo.query({
				query: getDashboard,
				variables: {
					token: this.AuthService.getToken()
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.user;
			}, err => this.graphqlService.error(err));
	}
	getProgressReport() {
		return this.apollo.query({
				query: gql `query getProgressReport($token:String!){
				restricted(token:$token){
					user{
						progressReport{
							topic {
								_id
								name
							}
							answered
							correct
							# standardDeviation
						}
					}
				}
			}`,
				variables: {
					token: this.AuthService.getToken()
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.user.progressReport;
			}, err => this.graphqlService.error(err));
	}
	updateProgressReport() {
		return this.apollo.mutate({
				mutation: gql `mutation updateProgressReport($token:String!){
				restricted(token:$token){
					progressReport{
						_id
					}
				}
			}`,
				variables: {
					token: this.AuthService.getToken()
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.progressReport;
			}, err => this.graphqlService.error(err));
	}
	changeAccessLevel(accessLevel, user) {
		return this.apollo.mutate({
				mutation: accessLevelMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: user._id,
					accessLevel: accessLevel
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
	addSubscription(plan) {
		return this.apollo.mutate({
				mutation: gql `mutation addSubscription($token:String!, $plan:String!){
				restricted(token:$token){
					addSubscription(plan:$plan){
						id
						cancel_at_period_end
						canceled_at
						created
						current_period_end
						current_period_start
						ended_at
						plan {
							amount
							created
							currency
							interval
							interval_count
							name
							trial_period_days
						}
						status
					}
				}
			}`,
				variables: {
					token: this.AuthService.getToken(),
					plan
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Subscription Added');
				return result.addSubscription;
			}, err => this.graphqlService.error(err));
	}
	reenableSubscription(id, plan) {
		return this.apollo.mutate({
				mutation: gql `mutation reenableSubscription($token:String!, $id:String!, $plan:String!){
				restricted(token:$token){
					reenableSubscription($id:id, plan:$plan){
						cancel_at_period_end
						status
					}
				}
			}`,
				variables: {
					token: this.AuthService.getToken(),
					id,
					plan
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				if (result.reenableSubscription.status === 'active') {
					this.toastService.simple('Subscription re-enabled.');
				}
				return result.reenableSubscription;
			}, err => this.graphqlService.error(err));
	}
	cancelSubscription(id) {
		return this.apollo.mutate({
				mutation: gql `mutation cancelSubscription($token:String!, $id:String!){
					restricted(token:$token){
						cancelSubscription(id:$id){
							status
							current_period_end
				    }
				  }
				}`,
				variables: {
					token: this.AuthService.getToken(),
					id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Subscription Canceled.');
				return result.cancelSubscription;
			}, err => this.graphqlService.error(err));
	}
	updateCard(stripeToken) {
		return this.apollo.mutate({
				mutation: gql `mutation updateCard($token:String!, $stripeToken: String!){
				restricted(token:$token){
					updateCard(stripeToken:$stripeToken){
						id
						brand
						country
						exp_month
						exp_year
						last4
					}
				}
			}`,
				variables: {
					token: this.AuthService.getToken(),
					stripeToken
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Card Updated');
				return result.updateCard;
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
