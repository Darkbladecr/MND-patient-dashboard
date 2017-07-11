import jwt from 'jsonwebtoken';

export default function(req, res, next) {
	let token = req.headers.authorization;
	if (token) {
		token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).send('Token is invalid or missing.');
			}
			if (!decoded) {
				return res.status(401).send('Token is invalid or missing.');
			} else {
				let today = parseInt(Date.now() / 1000);
				if ('exp' in decoded) {
					if (decoded.exp <= today) {
						return res.status(400).send('Token Expired');
						// } else if (decoded.activeUntil <= today) {
						// 	return res.status(401).send('Your account has Expired.');
					} else {
						req.payload = decoded;
						next();
					}
				} else {
					return res.status(401).send('Token is invalid or missing.');
				}
			}
		});
	} else {
		return res.status(401).send('Token is invalid or missing.');
	}
}
