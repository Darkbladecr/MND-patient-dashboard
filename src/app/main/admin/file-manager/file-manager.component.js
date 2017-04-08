import template from './file-manager.html';

class controller {
	constructor($ngRedux, $mdSidenav, toastService, pictureService, AuthService) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdSidenav = $mdSidenav;
		this.toastService = toastService;
		this.pictureService = pictureService;

		const token = AuthService.getToken();
		this.flowOptions = {
			target: '/api/pictures',
			headers: {
				'X-Requested-By': 'QuesWebApp',
				'Authorization': token ? 'Bearer ' + token : null
			}
		}

		this.selected = {};
		this.currentView = 'grid';
		this.path = ['Files'];
		this.files = [];
	}
	$onInit() {
		this.unsubscribe = this.store.connect(this.mapStateToThis)(this);
		this.getPictures();
	}
	mapStateToThis(state) {
		return {
			selectedTopic: state.topic,
			topics: state.topics
		};
	}
	getPictures() {
		// let topics = this.selectedTopic._id ? [this.selectedTopic._id] : null;
		this.pictureService.search(null).then((pictures) => {
			this.files = pictures ? pictures.map((f) => {
				f.type = 'picture';
				return f;
			}) : [];
		});
	}
	uploadComplete($file, $message, $flow) {
		this.toastService.simple($message);
		$flow.cancel();
		this.getPictures();
	}
	uploadError($file, $message, $flow) {
		this.toastService.simple($message);
		$flow.cancel();
	}
	select(file) {
		this.selected = file;
		this.lightbox = file.caption.length ? `<a class="lightbox" href="${file.path}" data-sub-html="${file.caption}"><img src="${file.path_thumb}" /></a>` :
			`<a class="lightbox" href="${file.path}"><img src="${file.path_thumb}" /></a>`;
	}
	toggleDetails(file) {
		this.selected = file;
		this.lightbox = file.caption.length ? `<a class="lightbox" href="${file.path}" class="lightbox" data-sub-html="${file.caption}"><img src="${file.path_thumb}" /></a>` :
			`<a class="lightbox" href="${file.path}"><img src="${file.path_thumb}" /></a>`;
		this.toggleSidenav('details-sidenav');
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	toggleView() {
		this.currentView = this.currentView === 'list' ? 'grid' : 'list';
	}
}

export default {
	bindings: {},
	controller,
	template
};
