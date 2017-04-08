import angular from 'angular';
export default class QuestionDialogController {
	constructor($ngRedux, $mdDialog, QuestionActions, CategoryActions, $scope, $timeout, question) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.$timeout = $timeout;

		this.copyMessage = 'Copy to clipboard';
		this.title = '_id' in question ? 'Edit Question' : 'New Question';
		let actions = Object.assign({}, QuestionActions, CategoryActions);
		let unsubscribe = this.store.connect(this.mapStateToThis, actions)(this);
		if ('_id' in question) {
			this.question = question;
		} else {
			this.question = {
				question: '',
				choices: [{
					label: 'a',
					name: '',
					answer: true
				}, {
					label: 'b',
					name: '',
					answer: false
				}, {
					label: 'c',
					name: '',
					answer: false
				}, {
					label: 'd',
					name: '',
					answer: false
				}, {
					label: 'e',
					name: '',
					answer: false
				}],
				author: this.store.getState().user._id,
				explanation: '',
				category: [],
				concept: null,
				topic: this.store.getState().topic
			};
		}
		$scope.$on('$destroy', unsubscribe);
	}
	mapStateToThis(state) {
		return {
			categories: state.categories,
			concepts: state.admin.concepts
		};
	}
	copied() {
		this.copyMessage = 'Copied!';
		this.$timeout(() => this.copyMessage = 'Copy to clipboard', 3000);
	}
	saveQuestion() {
		this.question.category = this.question.category.map((e) => e._id);
		this.question.topic = this.question.topic._id;
		this.question.concept = this.question.concept ? this.question.concept._id : null;
		if (!this.question.concept) {
			delete this.question.concept;
		}
		if ('_id' in this.question) {
			this.updateQuestion(this.question);
			return this.closeDialog();
		} else {
			this.createQuestion(this.question).then(() => this.closeDialog());
		}
	}
	closeDialog() {
		this.$mdDialog.hide();
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
	querySearch(query, array) {
		return query ? array.filter(this.execSearch(query)) : [];
	}
	execSearch(query) {
		const search = new RegExp(query.toLowerCase());
		return function(element) {
			return search.test(element.name.toLowerCase());
		}
	}
	createCategory(name) {
		if (angular.isObject(name)) {
			return name;
		}
		this.saveCategory(name.trim());
		this.categorySearch = '';
		return undefined;
	}
	addConcept(name) {
		this.saveConcept(name);
		this.$timeout(() => {
			this.question.concept = this.concepts[this.concepts.length - 1];
		}, 1000);
	}
}
