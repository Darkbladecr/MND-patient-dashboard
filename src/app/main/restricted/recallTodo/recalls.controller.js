import angular from 'angular';
import recallTutorial from '../../samples/recalls/recallTutorial.html';

class controller {
	constructor($ngRedux, TodoActions, todoService, $mdSidenav, $document, $scope, $timeout, $mdDialog, $state, $cookies, $window) {
		'ngInject';
		this.unsubscribe = $ngRedux.connect(this.mapStateToThis, TodoActions)(this);

		this.todoService = todoService;
		this.$mdSidenav = $mdSidenav;
		this.$document = $document;
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$mdDialog = $mdDialog;
		this.$state = $state;
		this.$cookies = $cookies;
		this.$window = $window;

		this.selected = {};
		this.metadata = {
			remaining: 0,
			completed: 0,
			timerStart: Date.now(),
			red: 0,
			amber: 0,
			green: 0
		};
		this.answered = false;
	}
	$onInit() {
		this.$document.on('keydown', (event) => {
			return this.$scope.$apply(this.shortcut(event));
		});
		if (!this.todo.hasOwnProperty('recalls')) {
			this.setup(500, 0);
		} else {
			this.setup(0, 0);
		}
	}
	setup(timer, errCount) {
		if (errCount < 10) {
			return this.$timeout(() => {
				try {
					const recalls = this.todo.recalls;
					this.recallIds = recalls.map(e => e._id);
					this.recalls = recalls.map((q) => {
						q.categories = q.category.map(e => e.name);
						return q;
					});

					let lastQIndex = -1;
					if (this.todo.marks.length > 0) {
						const lastQ = this.todo.marks[this.todo.marks.length - 1].recall;
						lastQIndex = this.recalls.findIndex((q) => q._id === lastQ);
					}

					this.selected = lastQIndex + 1 < this.recalls.length ? this.recalls[lastQIndex + 1] : this.recalls[0];
					this.metadata.completed = this.todo.marks.length / this.recalls.length * 100;
					this.metadata.remaining = this.recalls.length - this.todo.marks.length;
					this.metadata.red = this.todo.marks.reduce((a,b) => a + (b.score < 3 ? 1 : 0), 0);
					this.metadata.amber = this.todo.marks.reduce((a,b) => a + (b.score === 3 ? 1 : 0), 0);
					this.metadata.green = this.todo.marks.reduce((a,b) => a + (b.score > 3 ? 1 : 0), 0);
					this.isAnswered(this.selected._id);
				} catch (err) {
					errCount += 1;
					this.setup(timer, errCount);
				}
			}, timer);
		} else {
			this.$state.go('app.restricted_dashboard');
		}
	}
	mapStateToThis(state) {
		return {
			user: state.user,
			todo: state.todo
		};
	}
	$onDestroy() {
		this.unsubscribe();
		this.$document.unbind('keydown');
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	pageChange() {
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('recall-card'));
		container.scrollTop(0);
	}
	selectRecall(index) {
		if (this.recalls[index]) {
			this.selected = this.recalls[index];
			this.isAnswered(this.selected._id);
			this.$mdSidenav('main-sidenav').close();
			this.pageChange();
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
		const mark = this.todo.marks.find((e) => e.recall === _id);
		return mark ? parseInt(mark.score) : undefined;
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
		const mark = {
			recall: this.selected._id,
			score: score,
			timeTaken: Date.now() - this.metadata.timerStart
		};
		this.scoreRecall(mark);
		if(score > 3){
			this.metadata.green += 1;
		} else if(score === 3){
			this.metadata.amber += 1;
		} else if(score < 3){
			this.metadata.red += 1;
		}
		this.metadata.completed = this.todo.marks.length / this.recalls.length * 100;
		if (this.recalls.length !== this.todo.marks.length) {
			this.metadata.remaining -= 1;
			this.metadata.timerStart = Date.now();
		}
		this.todoService.saveTodo(this.todo);
		this.nextQuestion(1);
	}
	nextQuestion(num) {
		if (this.recalls.length === this.todo.marks.length) {
			return this.completedDialog();
		} else {
			for (let i = 0; i < this.recalls.length; i++) {
				if (this.recalls[i]._id === this.selected._id) {
					this.selectRecall(i + num);
					break;
				}
			}
		}
	}
	swipe(num) {
		if (angular.element('html').hasClass('is-mobile')) {
			return this.nextQuestion(num);
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
			.textContent('You have completed all the questions, would you like to exit?')
			.ariaLabel('Exam Completed')
			.ok('Exit')
			.cancel('Cancel')
		).then(() => this.$state.go('app.restricted_dashboard'));
	}
}

export default controller;
