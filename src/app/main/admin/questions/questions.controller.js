import angular from 'angular';
import QuestionDialogController from './dialogs/question-dialog.controller';
import template from './dialogs/question-dialog.html';

export default class QuestionsController {
	constructor($ngRedux, $timeout, $mdDialog, $mdSidenav, questionsService, QuestionActions, CategoryActions, AuthService, $scope, $q, toastService, $window) {
		'ngInject';
		this.store = $ngRedux;
		this.$timeout = $timeout;
		this.$mdDialog = $mdDialog;
		this.$mdSidenav = $mdSidenav;
		this.questionsService = questionsService;
		this.CategoryActions = CategoryActions;
		this.QuestionActions = QuestionActions;
		this.AuthService = AuthService;
		this.$scope = $scope;
		this.$q = $q;
		this.toastService = toastService;
		this.$window = $window;

		this.selected = [];
		this.search = {
			text: '',
			author: ''
		};
		this.regexId = /^[a-f\d]{24}$/;
		var bookmark;
		this.$scope.$watch(() => this.search.text, (newValue, oldValue) => {
			if (!oldValue) {
				bookmark = this.query.page;
			}
			if (newValue !== oldValue) {
				this.query.page = 1;
				this.getQuestions();
			}
			if (!newValue) {
				this.query.page = bookmark;
			}

		});
		if (AuthService.getAccessLevel() === 'administrator') {
			this.administrator = true;
		} else {
			this.administrator = false;
		}
		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true
		};
		this.query = {
			order: '-category',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1
		};
	}
	$onInit(){
		let actions = Object.assign({}, this.CategoryActions, this.QuestionActions);
		this.unsubscribe = this.store.connect(this.mapStateToThis, actions)(this);
		this.questionsService.getAuthors().then((data) => {
			this.authors = data;
		});
		this.getTopics();
		this.getQuestions();
	}
	$onDestroy(){
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			topics: state.topics,
			selectedTopic: state.topic,
			categories: state.categories,
			selectedCategory: state.category,
			questions: state.admin.questions
		};
	}
	getQuestions() {
		const deferred = this.$q.defer();
		this.promise = deferred.promise;
		if (this.regexId.test(this.search.text)) {
			this.searchQuestionsById(this.search.text).then((question) => {
				this.selectTopic(question.topic);
				this.selectCategory(this.selectedCategory);
				this.getCategories();
				return deferred.resolve();
			});
		} else {
			const search = Object.assign({}, this.search, { topic: [this.selectedTopic._id], category: [this.selectedCategory._id] });
			this.searchQuestions(search).then(() => deferred.resolve());
		}
	}
	onTopicSelected(topic) {
		this.selectTopic(topic);
		this.selectCategory(this.selectedCategory);
		this.getCategories();
		this.getConcepts();
		this.getQuestions();
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	onCategorySelected(category) {
		this.selectCategory(category);
		this.getQuestions();
	}
	resetFilters() {
		this.search.text = '';
		this.search.author = '';
		this.selectCategory(this.selectedCategory);
		this.getQuestions();
	}
	pageChange(){
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
	addQuestion(ev) {
		if (this.selectedTopic) {
			this.$mdDialog.show({
				locals: {
					event: ev,
					question: {},
					categories: this.categories,
					topic: this.selectedTopic
				},
				controller: QuestionDialogController,
				controllerAs: 'vm',
				template,
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: true
			});
		} else {
			this.toastService.simple('Select a topic first.');
		}
	}
	editQuestion(ev, question) {
		this.questionsService.getByID(question._id).then((question) => {
			this.$mdDialog.show({
				locals: {
					event: ev,
					question: angular.copy(question),
					categories: this.categories,
					topic: this.selectedTopic
				},
				controller: QuestionDialogController,
				controllerAs: 'vm',
				template,
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: true
			}).then(() => {
				this.selected = [];
			});
		});
	}
	deleteConfirm(event) {
		const tense = this.selected.length > 1 ? 'these' : 'this';
		const questionString = this.selected.length > 1 ? 'questions ' : '';
		var confirm = this.$mdDialog.confirm()
			.title(`Are you sure you want to delete ${tense} ${this.selected.length}${questionString}?`)
			.textContent('Please note this will also delete the stats!')
			.ariaLabel('Are you sure you want to delete these questions?')
			.targetEvent(event)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			const question = angular.copy(this.selected[0]);
			this.deleteQuestion(question);
			this.selected = [];
		});
	}
}
