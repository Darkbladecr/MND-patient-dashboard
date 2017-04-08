/* jshint -W138 */
'use strict';

import reject from 'lodash/reject';
import angular from 'angular';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const GET_TOPICS = 'GET_TOPICS';

export const GET_CURRENT_TOPIC = 'GET_CURRENT_TOPIC';

export const GET_CATEGORIES = 'GET_CATEGORIES';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const RESET_SELECTED_CATEGORY = 'RESET_SELECTED_CATEGORY';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const GET_CONCEPTS = 'GET_CONCEPTS';
export const CREATE_CONCEPT = 'CREATE_CONCEPT';
export const UPDATE_CONCEPT = 'UPDATE_CONCEPT';
export const DELETE_CONCEPT = 'DELETE_CONCEPT';

//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const CategoryActions = (categoriesService) => {
	'ngInject';

	const getTopics = () => {
		return (dispatch) => {
			return categoriesService.getTopics()
				.then(topics => dispatch({ type: GET_TOPICS, payload: topics }));
		};
	};

	const selectTopic = topic => {
		return { type: GET_CURRENT_TOPIC, payload: angular.copy(topic) };
	};

	const getCategories = () => {
		return (dispatch, getState) => {
			const { topic } = getState();

			return categoriesService.getTopicById(topic._id)
				.then(topic => dispatch({ type: GET_CATEGORIES, payload: topic.categories }));
		};
	};

	const selectCategory = (newCategory) => {
		return (dispatch, getState) => {
			const { category } = getState();
			if (newCategory) {
				if (category._id === newCategory._id) {
					return dispatch({ type: SELECT_CATEGORY });
				} else {
					return dispatch({ type: SELECT_CATEGORY, payload: angular.copy(newCategory) });
				}
			} else {
				return dispatch({ type: SELECT_CATEGORY });
			}
		};
	};

	const saveCategory = (category) => {
		return (dispatch, getState) => {
			const { topic } = getState();
			const hasId = !!category._id;
			const type = hasId ? UPDATE_CATEGORY : CREATE_CATEGORY;

			if (type === CREATE_CATEGORY) {
				return categoriesService.createCategory(category, topic._id)
					.then(newCategory => dispatch({ type, payload: newCategory }));
			} else if (type === UPDATE_CATEGORY) {
				return categoriesService.updateCategory(category)
					.then(() => dispatch({ type, payload: category }));
			}
		};
	};

	const deleteCategory = category => {
		return (dispatch, getState) => {
			const { topic } = getState();
			categoriesService.removeCategory(category, topic);
			return dispatch({ type: DELETE_CATEGORY, payload: category });
		};
	};

	const getConcepts = () => {
		return (dispatch, getState) => {
			const { topic } = getState();

			return categoriesService.getTopicById(topic._id)
				.then(topic => dispatch({ type: GET_CONCEPTS, payload: topic.concepts }));
		};
	}

	const saveConcept = (concept) => {
		return (dispatch, getState) => {
			const { topic } = getState();
			const hasId = !!concept._id;
			const type = hasId ? UPDATE_CONCEPT : CREATE_CONCEPT;

			if (type === CREATE_CONCEPT) {
				return categoriesService.createConcept(concept, topic._id)
					.then(newConcept => dispatch({ type, payload: newConcept }));
			} else if (type === UPDATE_CONCEPT) {
				return categoriesService.updateConcept(concept)
					.then(() => dispatch({ type, payload: concept }));
			}
		};
	};

	const deleteConcept = concept => {
		return (dispatch, getState) => {
			const { topic } = getState();
			categoriesService.removeConcept(concept, topic);
			return dispatch({ type: DELETE_CONCEPT, payload: concept });
		};
	};

	return {
		getTopics,
		selectTopic,
		getCategories,
		selectCategory,
		saveCategory,
		deleteCategory,
		getConcepts,
		saveConcept,
		deleteConcept
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const topics = (state = [], { type, payload }) => {
	switch (type) {
		case GET_TOPICS:
			return payload || state;
		default:
			return state;
	}
};
let initialTopic = { _id: null };
export const topic = (state = initialTopic, { type, payload }) => {
	switch (type) {
		case GET_CURRENT_TOPIC:
			return payload || initialTopic;
		default:
			return state;
	}
};

export const categories = (state = [], { type, payload }) => {
	switch (type) {
		case GET_CATEGORIES:
			return payload || state;
		case CREATE_CATEGORY:
			return [...state, payload];
		case UPDATE_CATEGORY:
			return state.map(category => category._id === payload._id ? payload : category);
		case DELETE_CATEGORY:
			return reject(state, (category) => category._id === payload._id);
		default:
			return state;
	}
};

export const category = (state = initialTopic, { type, payload }) => {
	switch (type) {
		case SELECT_CATEGORY:
			return payload || initialTopic;
		default:
			return state;
	}
};

export const concepts = (state = [], { type, payload }) => {
	switch (type) {
		case GET_CONCEPTS:
			return payload || state;
		case CREATE_CONCEPT:
			return [...state, payload];
		case UPDATE_CONCEPT:
			return state.map(concept => concept._id === payload._id ? payload : concept);
		case DELETE_CONCEPT:
			return reject(state, (concept) => concept._id === payload._id);
		default:
			return state;
	}
}
