import angular from 'angular';
import gql from 'graphql-tag';
import recallTutorial from './recallTutorial.html';

class controller {
	constructor(apollo, graphqlService, $mdSidenav, $document, $scope, $mdDialog, $state, $cookies, $window) {
		'ngInject';
		this.apollo = apollo;
		this.graphqlService = graphqlService;
		this.$mdSidenav = $mdSidenav;
		this.$document = $document;
		this.$scope = $scope;
		this.$mdDialog = $mdDialog;
		this.$state = $state;
		this.$cookies = $cookies;
		this.$window = $window;

		this.recalls = [];
		this.todo = { marks: [] };
		this.metadata = {
			remaining: 0,
			completed: 0,
			red: 0,
			amber: 0,
			green: 0
		}
		this.answered = false;
	}
	$onInit() {
		this.$document.on('keydown', (event) => {
			return this.$scope.$apply(this.shortcut(event));
		});

		this.apollo.query({
				query: gql `query{
				sampleRecalls{
					_id
					question
					explanation
					category{
						name
					}
				}
			}`
			})
			.then(this.graphqlService.extract)
			.then(result => {
				this.recalls = result.sampleRecalls.map((q) => {
					q.categories = q.category.map(e => e.name);
					return q;
				});
				this.selected = this.recalls[0];
				this.metadata.remaining = this.recalls.length;
				this.isAnswered(this.selected._id);
				this.tutorialDialog();
			}, err => this.graphqlService.error(err));
	}
	$onDestroy() {
		this.$document.unbind('keydown');
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	selectRecall(index) {
		if (this.recalls[index]) {
			this.selected = this.recalls[index];
			this.isAnswered(this.selected._id);
			this.$mdSidenav('main-sidenav').close();
		}
	}
	shortcut(event) {
		if (!angular.element(document.body).hasClass('md-dialog-is-showing')) {
			if (event.keyCode === 32) {
				event.preventDefault();
				this.toggleCard();
			} else if (event.keyCode === 37) {
				event.preventDefault();
				this.selectRecall(this.recalls.findIndex((e) => e._id === this.selected._id) - 1);
			} else if (event.keyCode === 39) {
				event.preventDefault();
				this.selectRecall(this.recalls.findIndex((e) => e._id === this.selected._id) + 1);
			} else if (event.keyCode === 49 && this.answered) {
				this.scoreMark(1);
			} else if (event.keyCode === 50 && this.answered) {
				this.scoreMark(2);
			} else if (event.keyCode === 51 && this.answered) {
				this.scoreMark(3);
			} else if (event.keyCode === 52 && this.answered) {
				this.scoreMark(4);
			} else if (event.keyCode === 53 && this.answered) {
				this.scoreMark(5);
			}
		}
	}
	isAnswered(_id) {
		const find = this.todo.marks.find((e) => e.recall === _id);
		this.answered = find ? true : false;
	}
	isCompleted(_id) {
		return this.todo.marks.find((e) => e.recall === _id);
	}
	findScore(_id) {
		const find = this.todo.marks.find((e) => e.recall === _id);
		return find ? find.score : undefined;
	}
	toggleCard() {
		this.answered = !this.answered;
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('recall-card'));
		if (document.getElementById('answer-section')) {
			container.scrollToElementAnimated(angular.element(document.getElementById('answer-section')));
		} else {
			container.scrollTopAnimated(0);
		}
	}
	scoreMark(score) {
		this.todo.marks.push({
			recall: this.selected._id,
			score,
			lastAnswered: Date.now()
		});
		if(score > 3){
			this.metadata.green += 1;
		} else if(score === 3){
			this.metadata.amber += 1;
		} else if(score < 3){
			this.metadata.red += 1;
		}
		this.metadata.completed = this.todo.marks.length / this.recalls.length * 100;
		if (this.recalls.length === this.todo.marks.length) {
			return this.completedDialog();
		} else {
			this.metadata.remaining -= 1;
			this.nextQuestion(1);
		}
	}
	swipe(num) {
		if (angular.element('html').hasClass('is-mobile')) {
			return this.nextQuestion(num);
		}
	}
	nextQuestion(num) {
		if (this.recalls.length === this.todo.marks.length) {
			this.completedDialog();
		} else {
			for (let i = 0; i < this.recalls.length; i++) {
				if (this.recalls[i]._id === this.selected._id) {
					this.selectRecall(i + num);
					break;
				}
			}
		}
	}
	tutorialDialog() {
		if (!this.$cookies.get('recallTutorial')) {
			this.$mdDialog.show({
				controller: ($scope, $mdDialog) => {
					'ngInject';
					$scope.hide = function() {
						$mdDialog.hide();
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
				},
				template: recallTutorial,
				parent: angular.element(document.body),
			}).then(() => this.$cookies.put('recallTutorial', 'completed'));
		}
	}
	completedDialog() {
		this.$mdDialog.show(this.$mdDialog.confirm()
			.title('Exam Completed')
			.textContent('You have completed all the sample questions, would you like to subscribe?')
			.ariaLabel('Exam Completed')
			.ok('Subscribe now')
			.cancel('Cancel')
		).then(() => this.$state.go('app.pages_auth_register'));
	}
}

export default controller;
