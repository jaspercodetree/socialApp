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
			//預設追蹤
			followings: ['60e553e65cd1772ce8f1e3ea'],
		});

		//儲存&回傳值到前端
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

//postRefreshToken
router.post('/refresh', (req, res) => {
	//take the refresh token from the user
	let refreshToken = req.body.token;
	let refreshTokens = req.body.refreshTokens;

	//send error if there is no token or it's invalid
	if (!refreshToken)
		return res.status(401).json('You are not authenticated!');

	if (!refreshTokens.includes(refreshToken)) {
		return res.status(403).json('Refresh token is not valid!');
	}

	jwt.verify(refreshToken, 'myRefreshSecretKey', async (err) => {
		//找到此使用者
		let user = await User.findOne({ _id: req.body.userId });

		err && console.log(err);
		refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		//更新資料庫refreshTokens;
		await user.updateOne({
			$set: { refreshTokens: [newRefreshToken] },
		});

		//if everything is ok, create new access token, refresh token and send to user
		res.status(200).json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	});
});

const generateAccessToken = (user) => {
	return jwt.sign({ id: user._id }, 'mySecretKey', {
		//set access token expire time
		expiresIn: '3600s',
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
				// refreshTokens.push(refreshToken);

				//update refreshTokens in database
				try {
					await user.updateOne({
						$push: { refreshTokens: refreshToken },
					});
				} catch (err) {
					res.status(500).json(err);
				}

				res.status(200).json({
					...user._doc,
					accessToken: accessToken,
					refreshToken: refreshToken,
					refreshTokens: [refreshToken],
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
