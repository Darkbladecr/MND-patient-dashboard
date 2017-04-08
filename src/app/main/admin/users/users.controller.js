import angular from 'angular';
import UserDialogController from './dialogs/user-dialog.controller';
import dialogTemplate from './dialogs/user-dialog.html';

export default class UsersController {
	constructor($ngRedux, $mdDialog, $mdSidenav, UserActions, usersService, AuthService, $scope, $q, $window) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.$mdSidenav = $mdSidenav;
		this.UserActions = UserActions;
		this.usersService = usersService;
		this.AuthService = AuthService;
		this.$scope = $scope;
		this.$q = $q;
		this.$window = $window;

		this.selected = [];
		this.search = {
			text: '',
			accessLevel: { _id: null }
		};
		this.accessLevels = [{ _id: 1, name: 'subscriber' }, { _id: 2, name: 'author' }, { _id: 3, name: 'administrator' }];

		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true
		};

		this.query = {
			order: '-createdAt',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1
		};
		this.bookmark = null;
		this.$scope.$watch(() => this.search.text, (newValue, oldValue) => {
			if (!oldValue) {
				this.bookmark = this.query.page;
			}
			if (newValue !== oldValue) {
				this.query.page = 1;
				this.getUsers(this.search);
			}
			if (!newValue) {
				this.query.page = this.bookmark;
			}
		});
	}
	$onInit() {
		this.unsubscribe = this.store.connect(this.mapStateToThis, this.UserActions)(this);
		this.getUsers(this.search);
	}
	$onDestroy() {
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			users: state.admin.users,
			selectedUser: state.admin.user
		};
	}
	pageChange(){
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
	getUsers(search) {
		const deferred = this.$q.defer();
		this.promise = deferred.promise;
		const finalSearch = angular.copy(search);
		finalSearch.accessLevel = finalSearch.accessLevel.name;
		this.searchUsers(finalSearch).then(() => {
			deferred.resolve();
		});
	}
	addUser(ev) {
		this.resetSelectedUser();
		this.$mdDialog.show({
			locals: {
				event: ev,
				user: this.selectedUser
			},
			controller: UserDialogController,
			controllerAs: 'vm',
			template: dialogTemplate,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false,
			fullscreen: false
		});
	}

	editUser(ev, user) {
		this.getUserById(user._id).then(() => {
			this.$mdDialog.show({
				locals: {
					event: ev,
					user: this.selectedUser
				},
				controller: UserDialogController,
				controllerAs: 'vm',
				template: dialogTemplate,
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: false
			}).then(() => {
				this.resetSelectedUser();
				this.selected = [];
			});
		});
	}
	resetPassword(ev, user) {
		const confirm = this.$mdDialog.confirm()
			.title('Are you sure you want to reset ' + user.firstName + '\'s password?')
			.textContent(user.firstName + ' will be emailed to be able to setup a new password.')
			.ariaLabel('Are you sure you want to reset this user\'s password?')
			.targetEvent(ev)
			.ok('Reset')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.AuthService.reset(user.username).then(function() {
				this.selected = [];
			});
		});
	}

	deleteConfirm(ev, user) {
		const confirm = this.$mdDialog.confirm()
			.title('Are you sure you want to delete ' + user.firstName + '\'s account?')
			.textContent('Please note this will also delete their marksheets!')
			.ariaLabel('Are you sure you want to delete this user?')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.deleteUser(user);
		});
	}

	selectAccessLevel(accessLevel) {
		this.search.accessLevel = this.search.accessLevel._id === accessLevel._id ? { _id: null } : angular.copy(accessLevel);
		this.getUsers(this.search);
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	resetFilters() {
		this.search.text = '';
		this.search.accessLevel = {_id: null};
		this.getUsers(this.search);
	}

}
