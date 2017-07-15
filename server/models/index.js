import TempUser from './tempuser';
import User from './user';
import { Patient, Appointment, ALSFRS, ESS, FVC, SNP, ABG } from './patient';
import camo from 'camo';

// camo.connect(process.env.MONGODB).then(database => {
// 	db = database;
// 	const test = User.create({
// 		username: 'test@test.com',
// 		firstName: 'Stefan',
// 		lastName: 'Test',
// 	});
// 	test.setPassword('password123');
// 	test.save().then(u => {
// 		console.log('test user saved');
// 		console.log(u);
// 		User.findOne({ lastName: 'Test' }).then(u => {
// 			console.log('found user');
// 			console.log(u);
// 			setTimeout(function() {
// 				u.firstName = 'Stefan2';
// 				u.save().then(u => {
// 					console.log(u);
// 					User.deleteOne({ lastName: 'Test' });
// 				});
// 			}, 5000);
// 		});
// 	});
// });
camo.connect('nedb://database').then(() => {
	// const patient = Patient.create({
	// 	firstName: 'Joseph',
	// 	lastName: 'Blogger',
	// 	dateOfBirth: new Date(1966, 5, 20),
	// 	ethnicity: 'british',
	// 	gender: 'male',
	// 	appointments: [],
	// });
	// const appointment = {
	// 	_id: '5968ba4bc7dde44e1641bca6',
	// 	clinicDate: new Date(),
	// 	height: 1.8,
	// 	weight: 78.2,
	// 	assessor: 'doctor',
	// };
	// patient.appointments.push(Appointment.create(appointment));
	// patient.save().then(patient => {
	// 	console.log('patient saved');
	// 	console.log(patient);
	// 	Patient.deleteOne({ lastName: 'Blogger' });
	// });
});

export { User, TempUser, Patient, Appointment, ALSFRS, ESS, FVC, SNP, ABG };
