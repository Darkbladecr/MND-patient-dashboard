import angular from 'angular';
import RecallDialogController from './dialogs/recall-dialog.controller';
import template from './dialogs/recall-dialog.html';

export default class RecallsController {
	constructor($ngRedux, $mdDialog, $mdSidenav, recallsService, RecallActions, CategoryActions, AuthService, $scope, $q, toastService, $window) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.$mdSidenav = $mdSidenav;
		this.recallsService = recallsService;
		this.CategoryActions = CategoryActions;
		this.RecallActions = RecallActions;
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
				this.getRecalls();
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
		let actions = Object.assign({}, this.CategoryActions, this.RecallActions);
		this.unsubscribe = this.store.connect(this.mapStateToThis, actions)(this);
		this.recallsService.getAuthors().then((data) => {
			this.authors = data;
		});
		this.getTopics();
		this.getRecalls();
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
			recalls: state.admin.recalls
		};
	}
	getRecalls() {
		const deferred = this.$q.defer();
		this.promise = deferred.promise;
		if (this.regexId.test(this.search.text)) {
			this.searchRecallsById(this.search.text).then((question) => {
				this.selectTopic(question.topic);
				this.selectCategory(this.selectedCategory);
				this.getCategories();
				return deferred.resolve();
			});
		} else {
			const search = Object.assign({}, this.search, { topic: [this.selectedTopic._id], category: [this.selectedCategory._id] });
			this.searchRecalls(search).then(() => deferred.resolve());
		}
	}
	onTopicSelected(topic) {
		this.selectTopic(topic);
		this.selectCategory(this.selectedCategory);
		this.getCategories();
		this.getConcepts();
		this.getRecalls();
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	onCategorySelected(category) {
		this.selectCategory(category);
		this.getRecalls();
	}
	resetFilters() {
		this.search.text = '';
		this.search.author = '';
		this.selectCategory(this.selectedCategory);
		this.getRecalls();
	}
	pageChange(){
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
	addRecall(ev) {
		if (this.selectedTopic) {
			this.$mdDialog.show({
				locals: {
					event: ev,
					recall: {},
					categories: this.categories,
					topic: this.selectedTopic
				},
				controller: RecallDialogController,
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
	editRecall(ev, recall) {
		this.recallsService.getByID(recall._id).then((recall) => {
			this.$mdDialog.show({
				locals: {
					event: ev,
					recall: angular.copy(recall),
					categories: this.categories,
					topic: this.selectedTopic
				},
				controller: RecallDialogController,
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
			this.deleteRecall(question);
			this.selected = [];
		});
	}
}
