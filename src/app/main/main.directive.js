require('lightgallery.js');
import 'lightgallery.js/dist/css/lightgallery.css';
import './lightGallery.scss';

let lightGallery = window.lightGallery;

function lightgallery($timeout) {
	'ngInject';

	return {
		scope: {
			html: '<'
		},
		restrict: 'A',
		link: function(scope, element) {
			scope.$watch('html', () => {
				element.html(scope.html);
				$timeout(() => {
					const lgData = Object.keys(window.lgData);
					if (lgData.length > 1) {
						window.lgData[lgData[1]].destroy(true);
					}
					if (element[0].getElementsByClassName('lightbox')) {
						lightGallery(element[0], {
							selector: '.lightbox',
							download: false
						});
					}
				});
			});
		}
	};
}

export { lightgallery };
