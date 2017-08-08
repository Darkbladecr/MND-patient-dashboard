const TempUserSchema = require('./tempuser');
const UserSchema = require('./user');
const PatientSchema = require('./patient');
const AppointmentSchema = require('./appointment');
const LinvoDB = require('linvodb3');
const db = require('leveldown');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const { app } = require('electron');

const isWin = /^win/.test(process.platform);
let dbpath;
if (isWin) {
	dbpath = path.join(app.getPath('exe'), '..', '..', 'database');
} else {
	dbpath = path.join(app.getAppPath(), '../../../../', 'database');
}
LinvoDB.defaults.store = { db };
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
		'.4ab!]9uLu])w%MA'
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

module.exports = { User, TempUser, Patient, Appointment };
