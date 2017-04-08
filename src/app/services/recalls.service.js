import addRecall from '../graphql/admin/recalls/addRecall.gql';
import authorsQuery from '../graphql/admin/users/getAuthors.gql';
import deleteRecallMutation from '../graphql/admin/recalls/deleteRecall.gql';
import editRecall from '../graphql/admin/recalls/editRecall.gql';
import getRecall from '../graphql/admin/recalls/getRecall.gql';
import searchRecallsQuery from '../graphql/admin/recalls/searchRecalls.gql';

export default class questionsService {
	constructor(apollo, $http, AuthService, toastService, graphqlService) {
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	addRecall(question) {
		return this.apollo.mutate({
				mutation: addRecall,
				variables: {
					token: this.AuthService.getToken(),
					data: question
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Question added.');
				return result.addRecall;
			}, err => this.graphqlService.error(err));
	}
	getByID(_id) {
		return this.apollo.query({
				query: getRecall,
				variables: {
					token: this.AuthService.getToken(),
					_id: _id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.recall;
			}, err => this.graphqlService.error(err));
	}
	updateRecall(question) {
		const _id = question._id;
		delete question._id;
		return this.apollo.mutate({
				mutation: editRecall,
				variables: {
					token: this.AuthService.getToken(),
					_id: _id,
					data: question
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Question updated.');
				return result.editRecall;
			}, err => this.graphqlService.error(err));
	}
	getAll() {
		return this.apollo.query({
				query: searchRecallsQuery,
				variables: {
					token: this.AuthService.getToken(),
					search: null,
					author: null,
					category: null,
					topic: null
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.recalls;
			}, err => this.graphqlService.error(err));
	}
	search(search) {
		for (var k in search) {
			if (search[k].length === 0) {
				delete search[k];
			}
		}
		return this.apollo.query({
				query: searchRecallsQuery,
				variables: {
					token: this.AuthService.getToken(),
					search: search.text || '',
					author: search.author || null,
					category: search.category,
					topic: search.topic
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.recalls;
			}, err => this.graphqlService.error(err));
	}
	getAuthors() {
		return this.apollo.query({
				query: authorsQuery,
				variables: {
					token: this.AuthService.getToken()
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.authors;
			}, err => this.graphqlService.error(err));
	}
	removeRecall(_id) {
		return this.apollo.mutate({
				mutation: deleteRecallMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: _id
				}
			})
			.then(this.graphqlService.extract)
			.then(() => {
				this.toastService.simple('Question deleted.');
				return;
			}, err => this.graphqlService.error(err));
	}
}
