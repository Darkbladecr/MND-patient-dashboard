import angular from 'angular';
import gql from 'graphql-tag';
import buildTest from '../graphql/restricted/buildTest.gql';
import getMarksheetById from '../graphql/restricted/getMarksheetById.gql';
import getMarksheets from '../graphql/restricted/getMarksheets.gql';

class marksheetService {
	constructor(apollo, AuthService, toastService, graphqlService){
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	getMarksheetById(_id){
		return this.apollo.query({
			query: getMarksheetById,
			variables: {
				token: this.AuthService.getToken(),
				_id
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.marksheet;
		}, err => this.graphqlService.error(err));
	}
	getMarksheets(){
		return this.apollo.query({
			query: getMarksheets,
			variables: {
				token: this.AuthService.getToken(),
				_id: this.AuthService.getUserID()
			},
			fetchPolicy: 'network-only'
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.marksheets;
		}, err => this.graphqlService.error(err));
	}
	buildTest(search){
		return this.apollo.mutate({
			mutation: buildTest,
			variables: {
				token: this.AuthService.getToken(),
				questions: search.questions,
				topics: search.topics,
				categories: search.categories,
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.buildTest;
		}, err => this.graphqlService.error(err));
	}
	upvoteChoice(_id, label) {
		return this.apollo.mutate({
			mutation: gql`mutation upvoteChoice($token:String!, $_id:String!, $label:String!){
				restricted(token:$token){
					upvoteChoice(_id:$_id, label:$label)
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				_id,
				label
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.upvoteChoice;
		}, err => this.graphqlService.error(err));
	}
	saveMarksheet(marksheet){
		marksheet = angular.copy(marksheet);
		const timeTaken = marksheet.marks.reduce((sum, e) => e.timeTaken ? sum + e.timeTaken : sum, 0);
		const correct = marksheet.marks.reduce((sum, e) => e.correct ? sum + 1 : sum, 0);
		const percentage = Math.round(correct / marksheet.marks.length * 100);

		const update = {
			lastActivity: Date.now(),
			timeTaken,
			correct,
			percentage,
			marks: marksheet.marks
		};
		return this.apollo.mutate({
			mutation: gql`mutation saveMarksheet($token:String!, $_id: String!, $marksheet:MarksheetInput!){
				restricted(token:$token){
					saveMarksheet(_id:$_id, marksheet:$marksheet){
						_id
					}
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				_id: marksheet._id,
				marksheet: update
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.saveMarksheet;
		}, err => this.graphqlService.error(err));
	}
}

export default marksheetService;
