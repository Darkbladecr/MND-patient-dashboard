import './main-sidenav.scss';

import template from './main-sidenav.html';

class controller{
	constructor($ngRedux, CategoryActions){
		'ngInject';
		this.store = $ngRedux;
		this.CategoryActions = CategoryActions;

	}
	$onInit(){
		this.unsubscribe = this.store.connect(this.mapStateToThis, this.CategoryActions)(this);
	}
	$onDestroy(){
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			topics: state.topics,
			selectedTopic: state.topic
		};
	}
	onTopicSelected(topic){
		this.selectTopic(topic);
		this.getPictures();
	}
	reset(){
		this.onTopicSelected(null);
		this.getPictures();
	}
}

export default {
	bindings: {
		getPictures: '&'
	},
	controller,
	template
}
