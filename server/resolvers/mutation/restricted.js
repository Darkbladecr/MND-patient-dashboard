import { resetPassword, resetPasswordPrep, updateUser } from './restricted/users';
import { createPatient, updatePatient, deletePatient, addAppointment, updateAppointment, deleteAppointment } from './restricted/patients';

const RestrictedMutation = {
	resetPassword,
	resetPasswordPrep,
	updateUser,
	createPatient,
	updatePatient,
	deletePatient,
	addAppointment,
	updateAppointment,
	deleteAppointment
};

export { RestrictedMutation };
