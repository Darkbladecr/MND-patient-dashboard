/* jshint -W138 */
'use strict';
import reject from 'lodash/reject';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const GET_USERS = 'GET_USERS';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';

export const GET_SELECTED_USER = 'GET_SELECTED_USER';
export const RESET_SELECTED_USER = 'RESET_SELECTED_USER';
export const CHANGE_USER_ACCESS_LEVEL = 'CHANGE_USER_ACCESS_LEVEL';

//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const UserActions = (usersService, AuthService) => {
	'ngInject';

	const searchUsers = (search) => {
		return (dispatch) => {
			return usersService.getUsers(search)
				.then(users => dispatch({ type: GET_USERS, payload: users }));
		};
	};

	const getSelf = () => {
		return (dispatch) => {
			return usersService.getSelf()
				.then(user => {
					return dispatch({ type: GET_SELECTED_USER, payload: user })
				});
		}
	}

	const getUserById = (userId) => {
		return (dispatch, getState) => {
			const { user } = getState().admin;
			if (userId === user._id) {
				dispatch({ type: GET_SELECTED_USER, payload: null });
			} else {
				return usersService.getById(userId)
					.then(user => dispatch({ type: GET_SELECTED_USER, payload: user }));
			}
		};
	};

	const resetSelectedUser = () => {
		return { type: RESET_SELECTED_USER };
	};

	const createUser = (user) => {
		return (dispatch) => {
			return AuthService.register(user)
				.then(user => dispatch({ type: CREATE_USER, payload: user }));
		};
	};
	const updateUser = (user) => {
		return (dispatch) => {
			return usersService.updateUser(user)
				.then(user => dispatch({ type: UPDATE_USER, payload: user }));
		};
	};

	const editAccessLevel = (accessLevel, user) => {
		return (dispatch) => {
			return usersService.changeAccessLevel(accessLevel, user)
				.then(user => dispatch({ type: CHANGE_USER_ACCESS_LEVEL, payload: user }));
		};
	};

	const deleteUser = (user) => {
		return (dispatch) => {
			return usersService.deleteUser(user._id)
				.then(() => dispatch({ type: DELETE_USER, payload: user }));
		};
	};

	return {
		searchUsers,
		getSelf,
		getUserById,
		resetSelectedUser,
		createUser,
		updateUser,
		editAccessLevel,
		deleteUser
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const users = (state = [], { type, payload }) => {
	switch (type) {
		case GET_USERS:
			return payload || state;
		case CREATE_USER:
			return [...state, payload];
		case UPDATE_USER:
			return state.map(user => user._id === payload._id ? payload : user);
		case CHANGE_USER_ACCESS_LEVEL:
			return state.map(user => user._id === payload._id ? payload : user);
		case DELETE_USER:
			return reject(state, user => user._id === payload._id);
		default:
			return state;
	}
};

function generatePassword() {
	var length = 8,
		charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		retVal = '';
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}
const initialUser = {
	username: '',
	firstName: '',
	lastName: '',
	password: generatePassword()
};

export const user = (state = initialUser, { type, payload }) => {
	switch (type) {
		case GET_SELECTED_USER:
			return payload || state;
		case RESET_SELECTED_USER:
			return initialUser;
		default:
			return state;
	}
};
