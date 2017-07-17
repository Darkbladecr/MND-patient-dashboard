const { User } = require('../../../models');

function user({ _id }) {
	return new Promise((resolve, reject) => {
		User.findOne({ _id }, (err, user) => {
			if (err) {
				return reject(err);
			}
			return resolve(user);
		});
	});
}

module.exports = { user };
