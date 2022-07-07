const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register
router.post('/register', async (req, res) => {
	try {
		//產生bcrypt password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		//新增使用者
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashPassword,
		});

		//儲存&回傳值到前端
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

let refreshTokens = [];

router.post('/refresh', (req, res) => {
	//take the refresh token from the user
	const refreshToken = req.body.token;
	console.log('1', refreshTokens);

	//send error if there is no token or it's invalid
	if (!refreshToken)
		return res.status(401).json('You are not authenticated!');

	if (!refreshTokens.includes(refreshToken)) {
		return res.status(403).json('Refresh token is not valid!');
	}

	jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user) => {
		err && console.log(err);
		refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
		console.log('2', refreshTokens);

		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		refreshTokens.push(newRefreshToken);
		console.log('3', refreshTokens);

		res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	});

	//if everything is ok, create new access token, refresh token and send to user
});

const generateAccessToken = (user) => {
	return jwt.sign({ id: user._id }, 'mySecretKey', {
		expiresIn: '5s',
	});
};

const generateRefreshToken = (user) => {
	return jwt.sign({ id: user._id }, 'myRefreshSecretKey');
};

//login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user == null) {
			res.status(404).send('無法找到此使用者');
		}

		if (user) {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (validPassword == false) {
				res.status(400).json('密碼錯誤');
			} else {
				//Generate an access token
				const accessToken = generateAccessToken(user);
				const refreshToken = generateRefreshToken(user);
				refreshTokens.push(refreshToken);

				res.status(200).json({
					...user._doc,
					// username: user.username,
					// isAdmin: user.isAdmin,
					accessToken: accessToken,
					refreshToken: refreshToken,
				});
			}
		} else {
			res.status(400).json('Username or password incorrect!');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
