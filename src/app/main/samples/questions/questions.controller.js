import angular from 'angular';
import gql from 'graphql-tag';

class controller {
	constructor(apollo, graphqlService, $mdSidenav, $scope, $document, $mdDialog, $state, $window) {
		'ngInject';
		this.apollo = apollo;
		this.graphqlService = graphqlService;
		this.$mdSidenav = $mdSidenav;
		this.$scope = $scope;
		this.$document = $document;
		this.$mdDialog = $mdDialog;
		this.$state = $state;
		this.$window = $window;

		this.questions = [];
		this.marksheet = {
			// createdBy:
			createdAt: Date.now(),
			lastActivity: Date.now(),
			timeTaken: 0,
			correct: 0,
			percentage: 0,
			// topics:
			// categories:
			marks: [],
			questions: []
		};
		this.selected = {};
		this.metadata = {
			remaining: 0,
			completed: 0,
			timerStart: Date.now()
		}
		this.answered = false;
		this.guess = undefined;
	}
	$onInit() {
		this.$document.on('keydown', (event) => {
			return this.$scope.$apply(this.shortcut(event));
		});

		this.apollo.query({
				query: gql `query{
				sampleQuestions{
					_id
				    question
				    choices {
				      label
				      name
				      answer
					  votes
				    }
				    topic{
				      name
				    }
				    category{
				      name
				    }
					explanation
				}
			}`
			})
			.then(this.graphqlService.extract)
			.then(result => {
				const questions = result.sampleQuestions;
				this.marksheet.questions = questions.map(e => e._id);
				this.questions = questions.map((q) => {
					q.totalVotes = q.choices.reduce((votes, c) => c.votes + votes, 0);
					q.highestVotes = q.choices.map(c => c.votes).reduce((a, b) => Math.max(a, b), 0);
					q.categories = q.category.map(e => e.name);
					return q;
				});
				this.selected = this.questions[0];
				this.metadata.remaining = this.questions.length;
				this.isAnswered(this.selected._id);
			}, err => this.graphqlService.error(err));
	}
	$onDestroy() {
		this.$document.unbind('keydown');
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
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
		if (event.keyCode === 37){
			event.preventDefault();
			this.selectQuestion(this.questions.findIndex((e) => e._id === this.selected._id) - 1);
		} else if (event.keyCode === 39){
			event.preventDefault();
			this.selectQuestion(this.questions.findIndex((e) => e._id === this.selected._id) + 1);
		}
	}
	isAnswered(_id) {
		const find = this.marksheet.marks.find((e)=> e.question === _id);
		this.answered = find ? true : false;
		this.guess = find ? find.label : undefined;
		return find ? true : false;
	}
	isCompleted(_id){
		return this.marksheet.marks.find((e) => e.question === _id);
	}
	isAnsweredCorrectly(_id){
		const find = this.marksheet.marks.find((e) => e.question === _id);
		return find ? find.correct : null;
	}
	answerQuestion() {
		this.answered = true;
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('question-card'));
		container.scrollToElementAnimated(angular.element(document.getElementById('answer-section')));
		const answerIndex = this.selected.choices.findIndex((e) => e.answer);
		this.marksheet.marks.push({
			question: this.selected._id,
			label: this.guess,
			correct: this.guess === this.selected.choices[answerIndex].label,
			timeTaken: Date.now() - this.metadata.timerStart
		});
		this.metadata.remaining -= 1;
		this.metadata.completed = this.marksheet.marks.length / this.questions.length * 100;
		this.metadata.timerStart = Date.now();
	}
	choiceClass(label) {
		if ('_id' in this.selected) {
			const _id = this.selected._id;
			const index = this.marksheet.marks.findIndex((e)=>e.question === _id);
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
	nextQuestion() {
		if (this.questions.length === this.marksheet.marks.length) {
			this.completedDialog();
		} else {
			for (let i = 0; i < this.questions.length; i++) {
				if (this.questions[i]._id === this.selected._id) {
					this.selectQuestion(i + 1);
					break;
				}
			}
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
