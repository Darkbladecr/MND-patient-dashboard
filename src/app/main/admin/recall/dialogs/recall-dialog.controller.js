import angular from 'angular';
import './recall-dialog.scss';

export default class RecallDialogController {
	constructor($ngRedux, $mdDialog, RecallActions, questionsService, CategoryActions, $scope, $timeout, recall) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.$timeout = $timeout;
		this.regexId = /^[a-f\d]{24}$/;
		this.questionsService = questionsService;

		this.copyMessage = 'Copy to clipboard';
		this.title = '_id' in recall ? 'Edit Question' : 'New Question';
		let actions = Object.assign({}, RecallActions, CategoryActions);
		let unsubscribe = this.store.connect(this.mapStateToThis, actions)(this);
		if ('_id' in recall) {
			this.recall = recall;
		} else {
			this.recall = {
				question: '',
				author: this.store.getState().user._id,
				explanation: '',
				category: [],
				concept: null,
				topic: this.store.getState().topic,
				linked_question: null
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
	saveRecall() {
		this.recall.category = this.recall.category.map((e) => e._id);
		this.recall.topic = this.recall.topic._id;
		this.recall.concept = this.recall.concept ? this.recall.concept._id : null;
		this.recall.linked_question = this.recall.linked_question ? this.recall.linked_question._id : null;
		if ('_id' in this.recall) {
			this.updateRecall(this.recall);
			return this.closeDialog();
		} else {
			this.createRecall(this.recall).then(() => this.closeDialog());
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
			this.recall.concept = this.concepts[this.concepts.length - 1];
		}, 1000);
	}
	queryQuestions(text) {
		const search = {
			text,
			author: ''
		};
		if (this.regexId.test(search.text)) {
			return this.questionsService.getByID(search.text).then((question) => [question]);
		} else {
			const category = this.recall.category.map((e) => e._id);
			const query = Object.assign({}, search, { topic: [this.recall.topic._id], category });
			return this.questionsService.search(query).then((questions) => questions);
		}
	}
}
