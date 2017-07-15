const TempUserSchema = {
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
};
// TTL expires in 1 day = 3600*24
// let TTL = 3600 * 24 * 2; // 2 days
// TempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: TTL });

export default TempUserSchema;
