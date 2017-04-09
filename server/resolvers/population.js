import { Patient } from '../models';

const UserResolve = {
	patients(obj) {
		return Patient.find().where('_id').in(obj.patients);
	}
}

export { UserResolve };
