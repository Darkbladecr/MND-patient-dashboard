import './details-sidenav.scss';

import template from './details-sidenav.html';

class controller {
	constructor($window, $timeout, $mdSidenav, pictureService) {
		'ngInject';
		this.$window = $window;
		this.$timeout = $timeout;
		this.$mdSidenav = $mdSidenav;
		this.pictureService = pictureService;

		this.editing = false;
		this.copyMessage = 'Copy to clipboard';
	}
	copied(){
		this.copyMessage = 'Copied!';
		this.$timeout(()=> this.copyMessage = 'Copy to clipboard', 3000);
	}
	updatePicture() {
		let form = {
			name: this.file.name,
			caption: this.file.caption,
			topic: this.file.topic._id
		}
		this.pictureService.update(this.file._id, form).then(() => {
			this.editing = false;
			this.getPictures();
		});
	}
	download(file) {
		this.$window.open(file.path, '_blank');
	}
	delete(file) {
		this.pictureService.delete(file._id).then(() => {
			this.$mdSidenav('details-sidenav').toggle();
			this.getPictures();
		});
	}
}

export default {
	bindings: {
		file: '<',
		topics: '<',
		lightbox: '<',
		getPictures: '&'
	},
	template,
	controller
}
