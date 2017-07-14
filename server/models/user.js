import crypto from 'crypto';
import jwt from 'jsonwebtoken';

module.exports = function(db, DataTypes) {
	const User = db.define(
		'User',
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				set(val) {
					this.setDataValue('username', val.toLowerCase());
				},
			},
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			role: {
				type: DataTypes.STRING,
				defaultValue: 'doctor',
			},
			hash: DataTypes.STRING,
			salt: DataTypes.STRING,
		},
		{
			getterMethods: {
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
				},
				validPassword(password) {
					const hash = crypto
						.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
						.toString('hex');
					return this.hash === hash;
				},
			},
			setterMethods: {
				setPassword(password) {
					this.salt = crypto.randomBytes(16).toString('hex');
					this.hash = crypto
						.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
						.toString('hex');
				},
			},
		}
	);
	return User;
};
