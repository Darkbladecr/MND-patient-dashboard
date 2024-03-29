import crypto from 'crypto';
import mongoose from 'mongoose';

let TempUserSchema = new mongoose.Schema({
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
// TTL expires in 1 day = 3600*24
let TTL = 3600*24*2; // 2 days
TempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL });

TempUserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

export default TempUserSchema;
