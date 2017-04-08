export default class ConceptsController {
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
			concepts: state.admin.concepts
		};
	}

	onTopicSelected(topic) {
		this.selectTopic(topic);
		this.getConcepts();
	}

	submitConcept(event) {
		const keyCode = event.which || event.keyCode;
		if (keyCode === 13) {
			return this.addConcept();
		}
	}

	addConcept() {
		this.saveConcept(this.search.trim());
		this.search = '';
	}

	editConcept(event, concept) {
		event.stopPropagation(); // in case autoselect is enabled
		const editDialog = {
			modelValue: concept.name,
			placeholder: 'Concept name',
			save: (input) => {
				concept.name = input.$modelValue.trim();
				this.saveConcept(concept);
			},
			targetEvent: event,
			title: 'Concept name'
		};
		return this.$mdEditDialog.small(editDialog);
	}

	deleteConfirm(event, concept) {
		const confirm = this.$mdDialog.confirm()
			.title('Are you sure you want to delete this concept?')
			.textContent('Please note this will also remove the concept from the associated questions!')
			.ariaLabel('Are you sure you want to delete this concept?')
			.targetEvent(event)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.deleteConcept(concept);
		});
	}
}
