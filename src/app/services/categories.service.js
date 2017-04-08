import addCategoryMutation from '../graphql/admin/categories/addCategory.gql';
import addConceptMutation from '../graphql/admin/concepts/addConcept.gql';
import categoriesQuery from '../graphql/admin/categories/getCategories.gql';
import conceptsQuery from '../graphql/admin/concepts/getConcepts.gql';
import deleteCategoryMutation from '../graphql/admin/categories/deleteCategory.gql';
import deleteConceptMutation from '../graphql/admin/concepts/deleteConcept.gql';
import editCategoryMutation from '../graphql/admin/categories/editCategory.gql';
import editConceptMutation from '../graphql/admin/concepts/editConcept.gql';
import topicQuery from '../graphql/admin/topics/getTopic.gql';
import topicsQuery from '../graphql/admin/topics/getTopics.gql';

function toTitleCase(str) {
	return str.replace(/\w+/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

export default class categoriesService {
	constructor(apollo, AuthService, toastService, graphqlService) {
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	getCategories() {
		return this.apollo.query({
				query: categoriesQuery,
				variables: {
					token: this.AuthService.getToken()
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.categories;
			}, err => this.grahqlService.error(err));
	}
	getConcepts(){
		return this.apollo.query({
				query: conceptsQuery,
				variables: {
					token: this.AuthService.getToken()
				},
				fetchPolicy: 'network-only'
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.concepts;
			}, err => this.grahqlService.error(err));
	}
	getTopicById(topicId) {
		return this.apollo.query({
				query: topicQuery,
				variables: {
					token: this.AuthService.getToken(),
					_id: topicId
				},
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.topic;
			}, err => this.grahqlService.error(err));
	}
	getTopics() {
		return this.apollo.query({
				query: topicsQuery,
				variables: {
					token: this.AuthService.getToken()
				},
			})
			.then(this.graphqlService.extract)
			.then(result => {
				return result.topics;
			}, err => this.grahqlService.error(err));
	}
	createCategory(name, topicId) {
		let categoryName = toTitleCase(name);
			return this.apollo.mutate({
					mutation: addCategoryMutation,
					variables: {
						token: this.AuthService.getToken(),
						topic: topicId,
						name: categoryName
					}
				})
				.then(this.graphqlService.extract)
				.then(result => {
					this.toastService.simple('Category added.');
					return result.addCategory;
				}, err => {throw this.graphqlService.error(err)});
	}
	updateCategory(category) {
		return this.apollo.mutate({
				mutation: editCategoryMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: category._id,
					name: category.name
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.editCategory);
				return;
			}, err => this.grahqlService.error(err));
	}
	removeCategory(category, topic) {
		return this.apollo.mutate({
				mutation: deleteCategoryMutation,
				variables: {
					token: this.AuthService.getToken(),
					categoryId: category._id,
					topicId: topic._id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.deleteCategory);
				return;
			}, err => this.grahqlService.error(err));
	}
	createConcept(name, topicId) {
		let categoryName = toTitleCase(name);
			return this.apollo.mutate({
					mutation: addConceptMutation,
					variables: {
						token: this.AuthService.getToken(),
						topic: topicId,
						name: categoryName
					}
				})
				.then(this.graphqlService.extract)
				.then(result => {
					this.toastService.simple('Concept added.');
					return result.addConcept;
				}, err => {throw this.graphqlService.error(err)});
	}
	updateConcept(concept) {
		return this.apollo.mutate({
				mutation: editConceptMutation,
				variables: {
					token: this.AuthService.getToken(),
					_id: concept._id,
					name: concept.name
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.editConcept);
				return;
			}, err => this.grahqlService.error(err));
	}
	removeConcept(concept, topic) {
		return this.apollo.mutate({
				mutation: deleteConceptMutation,
				variables: {
					token: this.AuthService.getToken(),
					conceptId: concept._id,
					topicId: topic._id
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.toastService.simple(result.deleteConcept);
				return;
			}, err => this.grahqlService.error(err));
	}
}
