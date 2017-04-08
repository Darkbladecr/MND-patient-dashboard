import addQuestion from '../graphql/admin/questions/addQuestion.gql';
import authorsQuery from '../graphql/admin/users/getAuthors.gql';
import deleteQuestionMutation from '../graphql/admin/questions/deleteQuestion.gql';
import editQuestion from '../graphql/admin/questions/editQuestion.gql';
import getQuestion from '../graphql/admin/questions/getQuestion.gql';
import searchQuestionsQuery from '../graphql/admin/questions/searchQuestions.gql';

export default class questionsService {
	constructor(apollo, AuthService, toastService, graphqlService) {
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	addQuestion(question) {
		return this.apollo.mutate({
				mutation: addQuestion,
				variables: {
					token: this.AuthService.getToken(),
					data: question
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Question added.');
				return result.addQuestion;
			}, err => this.graphqlService.error(err));
	}
	getByID(_id) {
		return this.apollo.query({
				query: getQuestion,
				variables: {
					token: this.AuthService.getToken(),
					_id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.question;
			}, err => this.graphqlService.error(err));
	}
	updateQuestion(question) {
		const _id = question._id;
		delete question._id;
		return this.apollo.mutate({
				mutation: editQuestion,
				variables: {
					token: this.AuthService.getToken(),
					_id: _id,
					data: question
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple('Question updated.');
				return result.editQuestion;
			}, err => this.graphqlService.error(err));
	}
	getAll() {
		return this.apollo.query({
				query: searchQuestionsQuery,
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
				return result.questions;
			}, err => this.graphqlService.error(err));
	}
	search(search) {
		for (var k in search) {
			if (search[k].length === 0) {
				delete search[k];
			}
		}
		return this.apollo.query({
				query: searchQuestionsQuery,
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
				return result.questions;
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
	removeQuestion(_id) {
		return this.apollo.mutate({
				mutation: deleteQuestionMutation,
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
