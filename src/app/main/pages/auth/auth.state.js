/* jshint -W138 */
'use strict';
import { storePersistor } from '../../main.module';
//-------------------------------------------------------------------
// Constants
//-------------------------------------------------------------------
export const LOGIN = 'LOGIN';
export const UPDATE_JWT = 'UPDATE_JWT';
export const LOGOUT = 'LOGOUT';

//-------------------------------------------------------------------
// Actions
//-------------------------------------------------------------------
export const AuthActions = () => {
	'ngInject';

	const logIn = (user) => {
		return { type: LOGIN, payload: user };
	};

	const updateJWT = (user) => {
		return { type: UPDATE_JWT, payload: user };
	};

	const logOut = () => {
		storePersistor.purge();
		return { type: LOGOUT };
	};

	return {
		logIn,
		updateJWT,
		logOut
	};
};


//-------------------------------------------------------------------
// Reducers
//-------------------------------------------------------------------
export const user = (state = {}, { type, payload }) => {
	switch (type) {
		case LOGIN:
			return payload || state;
		case UPDATE_JWT:
			return payload || state;
		case LOGOUT:
			return {};
		default:
			return state;
	}
};
