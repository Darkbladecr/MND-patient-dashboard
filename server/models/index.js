import TempUserSchema from './tempuser';
import UserSchema from './user';
import PatientSchema from './patient';
import AppointmentSchema from './appointment';
import LinvoDB from 'linvodb3';
// import db from 'level-js';
// import db from 'leveldown';
// import db from 'medeadown';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import path from 'path';

const dbpath = path.join(process.cwd(), 'database');
// LinvoDB.defaults.store = { db };
LinvoDB.dbpath = dbpath;

const User = new LinvoDB('User', UserSchema, {
	filename: path.join(dbpath, 'User.db'),
});
User.ensureIndex({ fieldName: 'username', unique: true });
User.method('updateLastActivity', function() {
	this.lastActivity = new Date();
});

User.method('setPassword', function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
});
User.method('validPassword', function(password) {
	let hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
	return this.hash === hash;
});
User.method('generateJWT', function(days) {
	// set expiration to 1 day
	let today = new Date();
	let exp = new Date(today);
	exp.setDate(today.getDate() + days);

	return jwt.sign(
		{
			_id: this._id,
			firstName: this.firstName,
			lastName: this.lastName,
			username: this.username,
			exp: parseInt(exp.getTime() / 1000),
		},
		process.env.SECRET
	);
});
const TempUser = new LinvoDB('TempUser', TempUserSchema, {
	filename: path.join(dbpath, 'TempUser.db'),
});
TempUser.method('setPassword', function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64)
		.toString('hex');
});
const Patient = new LinvoDB('Patient', PatientSchema, {
	filename: path.join(dbpath, 'Patient.db'),
});
const Appointment = new LinvoDB('Appointment', AppointmentSchema, {
	filename: path.join(dbpath, 'Appointment.db'),
});

// Patient.remove({}, { multi: true });
// const appointment = {
// 	clinicDate: new Date(),
// 	weight: 72.6,
// 	height: 1.78,
// };
// const patient = new Patient({
// 	firstName: 'Joey',
// 	lastName: 'Test',
// 	dateOfBirth: new Date(1988, 6, 23),
// 	ethnicity: 'british',
// 	gender: 'male',
// });
// patient.save((err, patient) => {
// 	console.log(patient.appointments);
// 	Appointment.insert(appointment, (err, a) => {
// 		Patient.update(
// 			{
// 				_id: patient._id,
// 			},
// 			{ $set: { appointments: [a._id] } },
// 			{},
// 			(err, num, patient) => {
// 				console.log(patient.appointments);
// 			}
// 		);
// 	});
// });

export { User, TempUser, Patient, Appointment };
