// import reject from 'lodash/reject';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const BUILD_TEST = 'BUILD_TEST';
export const GET_MARKSHEET = 'GET_MARKSHEET';
export const ADD_MARK = 'ADD_MARK';


//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const MarksheetActions = (marksheetService) => {
	'ngInject';

	const getMarksheet = (id) => {
		return (dispatch) => {
			return marksheetService.getMarksheetById(id)
				.then(marksheet => dispatch({type: BUILD_TEST, payload: marksheet}));
		}
	}

	const buildTest = (search) => {
		return (dispatch) => {
			return marksheetService.buildTest(search)
				.then((marksheet) => dispatch({ type: BUILD_TEST, payload: marksheet }));
		};
	};

	const addMark = (mark) => {
		return (dispatch) => {
			marksheetService.upvoteChoice(mark.question, mark.label);
			return dispatch({ type: ADD_MARK, payload: mark });
		};
	};

	return {
		buildTest,
		addMark,
		getMarksheet
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const marksheet = (state = {}, { type, payload }) => {
	switch (type) {
		case BUILD_TEST:
			return payload || state;
		case ADD_MARK:
			state.marks = [...state.marks, payload];
			return state;
		default:
			return state;
	}
};
