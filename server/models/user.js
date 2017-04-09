import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastActivity: {
		type: Date,
		default: Date.now
	},
	patients: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Patient'
		}],
		default: []
	},
	role: {
		type: String,
		default: 'doctor'
	},
	hash: String,
	salt: String
});

UserSchema.methods.updateLastActivity = function() {
	this.lastActivity = new Date;
};

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};
UserSchema.methods.validPassword = function(password) {
	let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
	return this.hash === hash;
};
UserSchema.methods.generateJWT = function(days) {
	// set expiration to 1 day
	let today = new Date();
	let exp = new Date(today);
	exp.setDate(today.getDate() + days);

	return jwt.sign({
		_id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000),
	}, process.env.SECRET);
};

export default UserSchema;
