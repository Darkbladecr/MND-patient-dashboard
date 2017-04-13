import { Patient } from '../models';

const UserResolve = {
	patients(obj) {
		return Patient.find().where('_id').in(obj.patients);
	}
}

const PatientResolve = {

}

export { UserResolve, PatientResolve };
