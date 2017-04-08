export default class CategoriesController {
	constructor($ngRedux, CategoryActions, $mdDialog, $mdEditDialog) {
		'ngInject';

		this.store = $ngRedux;
		this.CategoryActions = CategoryActions;
		this.$mdDialog = $mdDialog;
		this.$mdEditDialog = $mdEditDialog;
		this.search = '';
	}
	$onInit() {
		this.unsubscribe = this.store.connect(this.mapStateToThis, this.CategoryActions)(this);
		this.getTopics();
	}
	$onDestroy() {
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			topics: state.topics,
			selectedTopic: state.topic,
			categories: state.categories
		};
	}

	onTopicSelected(topic) {
		this.selectTopic(topic);
		this.getCategories();
	}

	submitCategory(event) {
		const keyCode = event.which || event.keyCode;
		if (keyCode === 13) {
			return this.addCategory();
		}
	}

	addCategory() {
		this.saveCategory(this.search.trim());
		this.search = '';
	}

	editCategory(event, category) {
		event.stopPropagation(); // in case autoselect is enabled
		var editDialog = {
			modelValue: category.name,
			placeholder: 'Category name',
			save: (input) => {
				category.name = input.$modelValue.trim();
				this.saveCategory(category);
			},
			targetEvent: event,
			title: 'Category name'
		};
		return this.$mdEditDialog.small(editDialog);
	}

	deleteConfirm(event, category) {
		var confirm = this.$mdDialog.confirm()
			.title('Are you sure you want to delete this category?')
			.textContent('Please note this will also remove the category from the associated questions!')
			.ariaLabel('Are you sure you want to delete this category?')
			.targetEvent(event)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.deleteCategory(category);
		});
	}

}
