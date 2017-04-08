/* jshint -W138 */
'use strict';

import reject from 'lodash/reject';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const GET_QUESTIONS = 'GET_QUESTIONS';
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';

//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const QuestionActions = (questionsService) => {
	'ngInject';

	const searchQuestions = (search) => {
		return (dispatch) => {
			return questionsService.search(search)
				.then((questions) => {
					for (var i = 0; i < questions.length; i++) {
						questions[i].categoryNames = questions[i].category.map(e => e.name);
					}
					return dispatch({ type: GET_QUESTIONS, payload: questions });
				});
		};
	};
	const searchQuestionsById = (_id) => {
		return (dispatch) => {
			return questionsService.getByID(_id)
				.then((question) => {
					question.categoryNames = question.category.map(e => e.name);
					return dispatch({ type: GET_QUESTIONS, payload: [question] });
				});
		};
	};

	const createQuestion = (question) => {
		return (dispatch) => {
			return questionsService.addQuestion(question)
				.then(question => {
					question.categoryNames = question.category.map(e => e.name);
					return dispatch({ type: CREATE_QUESTION, payload: question });
				});
		};
	};
	const updateQuestion = (question) => {
		return (dispatch) => {
			return questionsService.updateQuestion(question)
				.then(question => {
					question.categoryNames = question.category.map(e => e.name);
					return dispatch({ type: UPDATE_QUESTION, payload: question });
				});
		};
	};

	const deleteQuestion = (question) => {
		return (dispatch) => {
			questionsService.removeQuestion(question._id).then(() => dispatch({ type: DELETE_QUESTION, payload: question }));
		};
	};

	return {
		searchQuestions,
		searchQuestionsById,
		createQuestion,
		updateQuestion,
		deleteQuestion
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const questions = (state = [], { type, payload }) => {
	switch (type) {
		case GET_QUESTIONS:
			return payload || state;
		case CREATE_QUESTION:
			return [...state, payload];
		case UPDATE_QUESTION:
			return state.map(question => question._id === payload._id ? payload : question);
		case DELETE_QUESTION:
			return reject(state, question => question._id === payload._id);
		default:
			return state;
	}
};
