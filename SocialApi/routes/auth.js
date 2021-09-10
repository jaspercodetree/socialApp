const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

//login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user == null) {
			res.status(404).send('無法找到此使用者');
		}

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (validPassword == false) {
			res.status(400).json('密碼錯誤');
		}

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
