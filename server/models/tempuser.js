import crypto from 'crypto';
const Document = require('camo').Document;

class TempUser extends Document {
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
		return 'tempusers';
	}
	setPassword(password) {
		this.salt = crypto.randomBytes(16).toString('hex');
		this.hash = crypto
			.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
			.toString('hex');
	}
}

export default TempUser;
