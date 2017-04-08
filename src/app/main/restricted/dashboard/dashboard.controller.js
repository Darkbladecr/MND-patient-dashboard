import angular from 'angular';
import './dashboard.scss';

class dashboardController {
	constructor($ngRedux, usersService, marksheetService, MarksheetActions, todoService, TodoActions, UserActions, $state, $mdDialog, $cookies) {
		'ngInject';
		let actions = Object.assign({}, MarksheetActions, TodoActions);
		this.unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

		this.usersService = usersService;
		this.marksheetService = marksheetService;
		this.todoService = todoService;
		this.$state = $state;
		this.$mdDialog = $mdDialog;
		this.$cookies = $cookies;

		this.progressReport = [];
		this.marksheets = [];
		this.todos = [];
		this.selected = [];
		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true
		};
		this.query = {
			order: '-createdAt',
			limit: 5,
			page: 1
		};
	}
	$onInit() {
		this.usersService.getDashboard().then(user => {
			this.user = user;
			this.completedRecalls = Object.keys(user.dailyTask.priority).reduce((sum, i) => sum + user.dailyTask.priority[i], 0);
			if (user.examDate) {
				let oneDay = 24 * 60 * 60 * 1000;
				const today = new Date();
				const examDate = new Date(user.examDate);
				const examCountdown = Math.round((examDate.getTime() - today.getTime()) / (oneDay));
				const day = Math.abs(examCountdown) === 1 ? 'day' : 'days';
				if (examCountdown > 0) {
					this.countdownMessage = `${day} until your exam.`;
				} else {
					this.countdownMessage = `${day} since your exam.`;
				}
				this.examCountdown = Math.abs(examCountdown);
			}
		});
		this.marksheetService.getMarksheets().then(marksheets => {
			this.marksheets = marksheets.map(e => {
				e.topics = e.topics.map(t => t.name).join('; ');
				e.categories = e.categories.map(c => c.name).join('; ');
				return e;
			});
		});
		this.todoService.getTodos().then(todos => {
			const todosEdit = todos.map(e => {
				e.topics = e.topics.map(t => t.name).join('; ');
				e.categories = e.categories.map(c => c.name).join('; ');
				e.red = e.marks.reduce((a,b) => a + (b.score < 3 ? 1 : 0), 0);
				e.amber = e.marks.reduce((a,b) => a + (b.score === 3 ? 1 : 0), 0);
				e.green = e.marks.reduce((a,b) => a + (b.score > 3 ? 1 : 0), 0);
				return e;
			});

			this.todos = todosEdit.filter(e => !e.dailyTask);
			const dailyTask = todosEdit.find(e => e._id === this.user.dailyTask._id);
			if(dailyTask){
				this.dailyTask = dailyTask;
			}
		});
		this.tutorialDialog();
	}
	$onDestroy() {
		this.unsubscribe();
	}
	mapStateToThis() {
		return {
			// user: state.user
		};
	}
	boxedClass(row, suffix) {
		if (row.correct >= 80) {
			return `green-${suffix}`;
		} else if (row.correct < 80 && row.correct >= 50) {
			return `amber-${suffix}`;
		} else if (row.correct < 50) {
			return `red-${suffix}`;
		}
	}
	review() {
		this.getMarksheet(this.selected[0]._id).then(() => this.$state.go('app.restricted_test'));
	}
	reviewRecalls(_id) {
		this.getTodo(_id).then(() => this.$state.go('app.restricted_recall'));
	}
	tutorialDialog() {
		if (!this.$cookies.get('dashboardTutorial')) {
			this.$mdDialog.show(
				this.$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('Dashboard Tutorial')
				.textContent('This is your dashboard, which will populate with progress from previous tests or study topics. You will also be able to review or complete your previous tests.')
				.ariaLabel('Dashboard Tutorial')
				.ok('Ok')
			).then(() => this.$cookies.put('dashboardTutorial', 'completed'));
		}
	}
}

export default dashboardController;
