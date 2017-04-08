/* jshint -W138 */
'use strict';

import reject from 'lodash/reject';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const GET_RECALLS = 'GET_RECALLS';
export const CREATE_RECALL = 'CREATE_RECALL';
export const UPDATE_RECALL = 'UPDATE_RECALL';
export const DELETE_RECALL = 'DELETE_RECALL';

//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const RecallActions = (recallsService) => {
	'ngInject';

	const searchRecalls = (search) => {
		return (dispatch) => {
			return recallsService.search(search)
				.then((recalls) => {
					for (var i = 0; i < recalls.length; i++) {
						recalls[i].categoryNames = recalls[i].category.map(e => e.name);
					}
					return dispatch({ type: GET_RECALLS, payload: recalls });
				});
		};
	};
	const searchRecallsById = (_id) => {
		return (dispatch) => {
			return recallsService.getByID(_id)
				.then((recall) => {
					recall.categoryNames = recall.category.map(e => e.name);
					return dispatch({ type: GET_RECALLS, payload: [recall] });
				});
		};
	};

	const createRecall = (recall) => {
		return (dispatch) => {
			return recallsService.addRecall(recall)
				.then(recall => {
					recall.categoryNames = recall.category.map(e => e.name);
					return dispatch({ type: CREATE_RECALL, payload: recall });
				});
		};
	};
	const updateRecall = (recall) => {
		return (dispatch) => {
			return recallsService.updateRecall(recall)
				.then(recall => {
					recall.categoryNames = recall.category.map(e => e.name);
					return dispatch({ type: UPDATE_RECALL, payload: recall });
				});
		};
	};

	const deleteRecall = (recall) => {
		return (dispatch) => {
			recallsService.removeRecall(recall._id).then(() => dispatch({ type: DELETE_RECALL, payload: recall }));
		};
	};

	return {
		searchRecalls,
		searchRecallsById,
		createRecall,
		updateRecall,
		deleteRecall
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const recalls = (state = [], { type, payload }) => {
	switch (type) {
		case GET_RECALLS:
			return payload || state;
		case CREATE_RECALL:
			return [...state, payload];
		case UPDATE_RECALL:
			return state.map(recall => recall._id === payload._id ? payload : recall);
		case DELETE_RECALL:
			return reject(state, recall => recall._id === payload._id);
		default:
			return state;
	}
};
