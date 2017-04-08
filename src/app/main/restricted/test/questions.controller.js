import angular from 'angular';

class controller {
	constructor($ngRedux, MarksheetActions, $mdSidenav, $scope, $document, $mdDialog, $state, $window, $timeout, marksheetService, usersService) {
		'ngInject';
		this.unsubscribe = $ngRedux.connect(this.mapStateToThis, MarksheetActions)(this);

		this.$mdSidenav = $mdSidenav;
		this.$scope = $scope;
		this.$document = $document;
		this.$mdDialog = $mdDialog;
		this.$state = $state;
		this.$window = $window;
		this.$timeout = $timeout;
		this.marksheetService = marksheetService;
		this.usersService = usersService;

		this.selected = {};
		this.metadata = {
			remaining: 0,
			completed: 0,
			timerStart: Date.now()
		};
		this.answered = false;
		this.guess = undefined;
	}
	$onInit() {
		this.$document.on('keydown', (event) => {
			return this.$scope.$apply(this.shortcut(event));
		});
		if (!this.marksheet.hasOwnProperty('questions')) {
			this.setup(500, 0);
		} else {
			this.setup(0, 0);
		}
	}
	setup(timer, errCount) {
		if (errCount < 10) {
			return this.$timeout(() => {
				try {
					const questions = this.marksheet.questions;
					this.questionIds = questions.map(e => e._id);
					this.questions = questions.map((q) => {
						q.totalVotes = q.choices.reduce((votes, c) => c.votes + votes, 0);
						q.highestVotes = q.choices.map(c => c.votes).reduce((a, b) => Math.max(a, b), 0);
						q.categories = q.category.map(e => e.name);
						return q;
					});

					let lastQIndex = -1;
					if (this.marksheet.marks.length > 0) {
						const lastQ = this.marksheet.marks[this.marksheet.marks.length - 1].question;
						lastQIndex = this.questions.findIndex((q) => q._id === lastQ);
					}

					this.selected = lastQIndex + 1 < this.questions.length ? this.questions[lastQIndex + 1] : this.questions[0];
					this.metadata.completed = this.marksheet.marks.length / this.questions.length * 100;
					this.metadata.remaining = this.questions.length - this.marksheet.marks.length;
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
			marksheet: state.marksheet
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
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
	selectQuestion(index) {
		if (this.questions[index]) {
			this.selected = this.questions[index];
			this.isAnswered(this.selected._id);
			this.$mdSidenav('main-sidenav').close();
			const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('question-card'));
			container.scrollTopAnimated(0);
		}
	}
	shortcut(event) {
		if (event.keyCode === 37) {
			event.preventDefault();
			this.selectQuestion(this.questions.findIndex((e) => e._id === this.selected._id) - 1);
		} else if (event.keyCode === 39) {
			event.preventDefault();
			this.selectQuestion(this.questions.findIndex((e) => e._id === this.selected._id) + 1);
		}
	}
	isAnswered(_id) {
		const find = this.marksheet.marks.find((e) => e.question === _id);
		this.answered = find ? true : false;
		this.guess = find ? find.label : undefined;
		return find ? true : false;
	}
	isCompleted(_id) {
		return this.marksheet.marks.find((e) => e.question === _id);
	}
	isAnsweredCorrectly(_id) {
		const find = this.marksheet.marks.find((e) => e.question === _id);
		return find ? find.correct : null;
	}
	answerQuestion() {
		this.answered = true;
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('question-card'));
		container.scrollToElementAnimated(angular.element(document.getElementById('answer-section')));
		const answerIndex = this.selected.choices.findIndex((e) => e.answer);
		this.addMark({
			question: this.selected._id,
			label: this.guess,
			correct: this.guess === this.selected.choices[answerIndex].label,
			timeTaken: Date.now() - this.metadata.timerStart
		});
		this.metadata.remaining -= 1;
		this.metadata.completed = this.marksheet.marks.length / this.questions.length * 100;
		this.metadata.timerStart = Date.now();
		this.marksheetService.saveMarksheet(this.marksheet);
		// if (this.metadata.remaining === 0) {
		// 	this.usersService.updateProgressReport();
		// }
	}
	choicePercentage() {
		const correctChoice = this.selected.choices.find((e) => e.answer);
		return correctChoice.votes / this.selected.totalVotes * 100;
	}
	choiceClass(label) {
		if ('_id' in this.selected) {
			const _id = this.selected._id;
			const index = this.marksheet.marks.findIndex((e) => e.question === _id);
			if (index > -1) {
				if (this.marksheet.marks[index].label === label) {
					return this.marksheet.marks[index].correct ? 'correct' : 'incorrect';
				} else {
					const answerIndex = this.selected.choices.findIndex((e) => e.answer);
					if (this.selected.choices[answerIndex].label === label) {
						return 'correct';
					}
				}
			}
		}
		return;
	}
	swipe(num) {
		if (angular.element('html').hasClass('is-mobile')) {
			return this.nextQuestion(num);
		}
	}
	nextQuestion(num) {
		if (this.questions.length === this.marksheet.marks.length) {
			this.completedDialog();
		} else {
			for (let i = 0; i < this.questions.length; i++) {
				if (this.questions[i]._id === this.selected._id) {
					this.selectQuestion(i + num);
					break;
				}
			}
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
