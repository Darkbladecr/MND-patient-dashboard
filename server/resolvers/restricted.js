import jwt from 'jsonwebtoken';

function restricted(obj, args) {
	return new Promise((resolve, reject) => {
		const token = args.token;
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				return reject('Token is invalid or missing.');
			}
			if (!decoded) {
				return reject('Token is invalid or missing.');
			} else {
				let today = parseInt(Date.now() / 1000);
				if ('exp' in decoded && 'activeUntil' in decoded) {
					if (decoded.exp <= today) {
						return reject('Token expired.');
					// } else if (decoded.activeUntil <= today) {
					// 	return reject('Your account has expired.');
					} else {
						resolve(decoded);
					}
				} else {
					return reject('Token is invalid or missing.');
				}
			}
		});
	});
}

function admin(obj, args) {
	return new Promise((resolve, reject) => {
		restricted(obj, args).then((decoded) => {
			if (decoded.accessLevel === 'administrator' || decoded.accessLevel === 'author') {
				return resolve(decoded);
			} else {
				return reject('Not Authorized.');
			}
		}, err => reject(err));
	});
}

export { restricted, admin };
