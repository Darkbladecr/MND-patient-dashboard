import { resetPassword, resetPasswordPrep, updateUser } from './restricted/users';
import { createPatient, addAppointment } from './restricted/patients';

const RestrictedMutation = {
	resetPassword,
	resetPasswordPrep,
	updateUser,
	createPatient,
	addAppointment
};

export { RestrictedMutation };
