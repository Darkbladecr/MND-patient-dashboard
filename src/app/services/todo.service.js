import angular from 'angular';
import gql from 'graphql-tag';
import buildTodo from '../graphql/restricted/buildTodo.gql';
import getTodoById from '../graphql/restricted/getTodoById.gql';
import getTodos from '../graphql/restricted/getTodos.gql';

class todoService {
	constructor(apollo, AuthService, toastService, graphqlService){
		'ngInject';
		this.apollo = apollo;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.graphqlService = graphqlService;
	}
	getTodoById(_id){
		return this.apollo.query({
			query: getTodoById,
			variables: {
				token: this.AuthService.getToken(),
				_id
			},
			fetchPolicy: 'network-only'
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.todo;
		}, err => this.graphqlService.error(err));
	}
	getTodos(){
		return this.apollo.query({
			query: getTodos,
			variables: {
				token: this.AuthService.getToken()
			},
			fetchPolicy: 'network-only'
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.todos;
		}, err => this.graphqlService.error(err));
	}
	buildTodo(categories){
		return this.apollo.mutate({
			mutation: buildTodo,
			variables: {
				token: this.AuthService.getToken(),
				categories
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.buildTodo;
		}, err => this.graphqlService.error(err));
	}
	scoreRecall(mark) {
		return this.apollo.mutate({
			mutation: gql`mutation scoreRecall($token:String!, $mark:TodoMarkInput!){
				restricted(token:$token){
					scoreRecall(mark:$mark)
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				mark
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.scoreRecall;
		}, err => this.graphqlService.error(err));
	}
	saveTodo(todo){
		todo = angular.copy(todo);
		const timeTaken = todo.marks.reduce((sum, e) => e.timeTaken ? sum + e.timeTaken : sum, 0);

		const update = {
			lastActivity: Date.now(),
			timeTaken,
			marks: todo.marks
		};
		return this.apollo.mutate({
			mutation: gql`mutation saveTodo($token:String!, $_id: String!, $todo:TodoInput!){
				restricted(token:$token){
					saveTodo(_id:$_id, todo:$todo){
						_id
					}
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				_id: todo._id,
				todo: update
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.saveTodo;
		}, err => this.graphqlService.error(err));
	}
}

export default todoService;
