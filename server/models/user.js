import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const Document = require('camo').Document;

class User extends Document {
	constructor() {
		super();
		this.schema({
			username: {
				type: String,
				lowercase: true,
				unique: true,
			},
			firstName: String,
			lastName: String,
			createdAt: {
				type: Date,
				default: Date.now,
			},
			lastActivity: {
				type: Date,
				default: Date.now,
			},
			role: {
				type: String,
				default: 'doctor',
			},
			hash: String,
			salt: String,
		});
	}
	static collectionName() {
		return 'users';
	}
	preSave() {
		this.lastActivity = new Date();
	}
	setPassword(password) {
		this.salt = crypto.randomBytes(16).toString('hex');
		this.hash = crypto
			.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
			.toString('hex');
	}
	validPassword(password) {
		const hash = crypto
			.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
			.toString('hex');
		return this.hash === hash;
	}
	generateJWT(days) {
		// set expiration to 1 day
		const today = new Date();
		const exp = new Date(today);
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
	}
}

export default User;
