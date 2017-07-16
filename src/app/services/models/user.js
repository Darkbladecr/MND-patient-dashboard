const UserSchema = {
	username: {
		type: String,
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

export default UserSchema;
