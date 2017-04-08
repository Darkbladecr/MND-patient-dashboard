import UKMedicalSchools from './enum/UKMedicalSchools';
import classYears from './enum/classYears';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

let progressReportSchema = new mongoose.Schema({
	topic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	answered: Number,
	correct: Number,
	standardDeviation: {
		type: Number,
		get: (num) => (num / 100).toFixed(2),
		set: (num) => num * 100
	}
}, { _id: false });

let recallMarkSchema = new mongoose.Schema({
	recall: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recall'
	},
	lastSeen: Date,
	score: {
		type: Number,
		get: (num) => (num / 100).toFixed(2),
		set: (num) => num * 100
	},
	iteration: {
		type: Number,
		default: 0
	}
}, { _id: false });

let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true
	},
	stripe: String,
	plan: String,
	activeUntil: Date,
	firstName: String,
	lastName: String,
	classYear: {
		type: String,
		enum: classYears
	},
	graduationYear: Number,
	university: {
		type: String,
		enum: UKMedicalSchools
	},
	examDate: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	lastActivity: {
		type: Date,
		default: Date.now
	},
	progressReport: {
		type: [progressReportSchema],
		default: []
	},
	completedQuestions: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question'
		}, { _id: false }],
		default: []
	},
	completedCorrectQuestions: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question'
		}, { _id: false }],
		default: []
	},
	completedRecalls: {
		type: [recallMarkSchema],
		default: []
	},
	dailyTask: {
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Todo'
		},
		scores: {
			green: Number,
			amber: Number,
			red: Number
		},
		priority: {
			risk10: {
				type: Number,
				default: 0
			},
			risk9: {
				type: Number,
				default: 0
			},
			risk8: {
				type: Number,
				default: 0
			},
			risk7: {
				type: Number,
				default: 0
			},
			risk6: {
				type: Number,
				default: 0
			},
			risk5: {
				type: Number,
				default: 0
			},
			risk4: {
				type: Number,
				default: 0
			},
			risk3: {
				type: Number,
				default: 0
			},
			risk2: {
				type: Number,
				default: 0
			},
			risk1: {
				type: Number,
				default: 0
			}
		}
	},
	accessLevel: {
		type: String,
		enum: ['subscriber', 'author', 'administrator'],
		default: 'subscriber'
	},
	hash: String,
	salt: String
});
UserSchema.index({
	username: 'text',
	firstName: 'text',
	lastName: 'text'
});

UserSchema.virtual('fullname').get(function() {
	return this.firstName + ' ' + this.lastName;
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
		accessLevel: this.accessLevel,
		activeUntil: parseInt(this.activeUntil / 1000),
		exp: parseInt(exp.getTime() / 1000),
	}, process.env.SECRET);
};

export default UserSchema;
