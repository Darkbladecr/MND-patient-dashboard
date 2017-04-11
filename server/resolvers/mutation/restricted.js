import { resetPassword, resetPasswordPrep, updateUser } from './restricted/users';
import { createPatient, updatePatient, addAppointment } from './restricted/patients';

const RestrictedMutation = {
	resetPassword,
	resetPasswordPrep,
	updateUser,
	createPatient,
	updatePatient,
	addAppointment
};

export { RestrictedMutation };
