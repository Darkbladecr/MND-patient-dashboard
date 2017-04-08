import './list-view.scss';

import template from './list-view.html';

export default {
	bindings: {
		files: '<',
		select: '&',
		toggleDetails: '&'
	},
	template
}
