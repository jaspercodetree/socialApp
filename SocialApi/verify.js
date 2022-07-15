const jwt = require('jsonwebtoken');

//api JWT verify
const verify = (req, res, next) => {
	const authHeader = req.headers.authorization;
	// console.log('authHeader', authHeader);

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, 'mySecretKey', (err, user) => {
			if (err) {
				return res.status(403).json('Token is not valid!');
			} else {
				next();
			}
		});
	} else {
		res.status(401).json('You are not authenticated!');
	}
};

module.exports = verify;
