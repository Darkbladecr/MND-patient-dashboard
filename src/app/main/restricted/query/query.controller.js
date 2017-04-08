import angular from 'angular';
import './query.scss';
import queryController from './queryDialog.controller';
import queryDialog from './queryDialog.html';
import './queryDialog.scss';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import preBuildTest from '../../../graphql/restricted/preBuildTest.gql';

class controller {
	constructor($ngRedux, CategoryActions, $mdSidenav, $scope, $mdDialog, AuthService, apollo, graphqlService, $cookies) {
		'ngInject';
		this.store = $ngRedux;
		this.CategoryActions = CategoryActions;
		this.$mdSidenav = $mdSidenav;
		this.$mdDialog = $mdDialog;
		this.AuthService = AuthService;
		this.apollo = apollo;
		this.graphqlService = graphqlService;
		this.$cookies = $cookies;

		this.selected = [];
		this.selectedIds = [];
		this.toggleText = false;
		$scope.$watch('$ctrl.selected', () => {
			this.selectedIds = this.selected.map((e) => e._id);
			this.toggleText = this.categories.length > 0 ? this.categories.length === intersection(this.selected, this.categories).length : false;
		}, true);
		$scope.$watch('$ctrl.categories', () => {
			this.categoriesFiltered = this.categories.filter((e) => e.questionCount > 0);
		}, true);
	}
	$onInit() {
		this.unsubscribe = this.store.connect(this.mapStateToThis, this.CategoryActions)(this);
		this.getTopics().then(() => {
			this.topicsFiltered = this.topics.filter(t => {
				return t.questionCount > 4;
			});
		});

	}
	$onDestroy() {
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			topics: state.topics,
			selectedTopic: state.topic,
			categories: state.categories
		};
	}
	toggleSelector(category) {
		delete category.$$hashKey;
		if (this.selected.length) {
			const ids = this.selected.map((e) => e._id);
			if (ids.includes(category._id)) {
				this.selected = this.selected.filter((e) => e._id !== category._id);
			} else {
				this.selected = [...this.selected, category];
			}
		} else {
			this.selected = [...this.selected, category];
		}
	}
	toggleAll() {
		const categories = this.categories.map(c => {
			delete c.$$hashKey;
			return c;
		});
		if (this.selected.length) {
			const selected = this.selected.map(c => {
				delete c.$$hashKey;
				return c;
			});
			if (categories.length === intersection(selected, categories).length) {
				this.selected = difference(selected, categories);
			} else {
				this.selected = [...difference(selected, categories), ...categories];
			}
		} else {
			this.selected = this.categories;
		}
	}
	onTopicSelected(topic) {
		this.selectTopic(topic);
		this.getCategories();
		this.$mdSidenav('main-sidenav').close();
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	selectQuestions(event) {
		const categories = this.selected.map((e) => e._id);
		this.apollo.mutate({
				mutation: preBuildTest,
				variables: {
					token: this.AuthService.getToken(),
					category: categories
				}
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const metadata = result.preBuildTest;
				this.$mdDialog.show({
					controller: queryController,
					controllerAs: '$ctrl',
					targetEvent: event,
					template: queryDialog,
					locals: {
						metadata
					},
					parent: angular.element(document.body),
				}).then(() => {
					return;
				});
			}, err => this.graphqlService.error(err));
	}
	tutorialDialog() {
		if (!this.$cookies.get('queryTutorial')) {
			this.$mdDialog.show(
				this.$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('Test Builder Tutorial')
				.textContent('This is where you build your tests. First choose a topic and then you can select the categories that you would like to study.')
				.ariaLabel('Test Builder Tutorial')
				.ok('Ok')
			).then(() => this.$cookies.put('queryTutorial', 'completed'));
		}
	}
}

export default controller;
