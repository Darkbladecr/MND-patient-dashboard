// import reject from 'lodash/reject';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const BUILD_TODO = 'BUILD_TODO';
export const GET_TODO = 'GET_TODO';
export const SCORE_RECALL = 'SCORE_RECALL';


//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const TodoActions = (todoService) => {
	'ngInject';

	const getTodo = (id) => {
		return (dispatch) => {
			return todoService.getTodoById(id)
				.then(todo => dispatch({type: BUILD_TODO, payload: todo}));
		}
	}

	const buildTodo = (categories) => {
		return (dispatch) => {
			return todoService.buildTodo(categories)
				.then((todo) => dispatch({ type: BUILD_TODO, payload: todo }));
		};
	};

	const scoreRecall = (mark) => {
		return (dispatch) => {
			todoService.scoreRecall(mark);
			return dispatch({ type: SCORE_RECALL, payload: mark });
		};
	};

	return {
		getTodo,
		buildTodo,
		scoreRecall
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const todo = (state = {}, { type, payload }) => {
	switch (type) {
		case BUILD_TODO:
			return payload || state;
		case SCORE_RECALL:
			state.marks = [...state.marks, payload];
			return state;
		default:
			return state;
	}
};
