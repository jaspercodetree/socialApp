const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

const verify = require('../verify');

//update
router.put('/:id', verify, async (req, res) => {
	if (req.body.userId === req.params.id) {
		//傳進來的資料如有密碼，將其要修改的密碼加密
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}

		//找到此使用者 更新資料
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				//將所有req的資料更新
				$set: req.body,
			});
			res.status(200).json('使用者資料已更新');
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(400).json('你只能更新自己的帳號');
	}
});

//delete
router.delete('/:id', verify, async (req, res) => {
	try {
		//先抓user來判斷是否是Admin
		const user = await User.findById(req.body.userId);

		if (req.body.userId === req.params.id || user.isAdmin) {
			await User.findByIdAndDelete(req.params.id);
			res.status(200).json('帳號已刪除');
		} else {
			res.status(400).json('你只能刪除自己的帳號');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//get
router.get('/', async (req, res) => {
	//設計兩種方式都可以取得使用者(名稱或id)
	const userId = req.query.userId;
	const username = req.query.username;
	try {
		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username: username });
		//透過user._doc 可以拿到整個資料，然後我們透過解構只去拿other(避開password 和 updateAt 資料不傳)，所以只回傳other
		const { password, updatedAt, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get all user
router.get('/all', async (req, res) => {
	try {
		let users = await User.find();

		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get recommend Users
router.get('/:id/recommendUsers', async (req, res) => {
	try {
		let authorFollowings = await User.findById(req.params.id).select(
			'followings'
		);
		//加入自己
		authorFollowings.followings.push(req.params.id);

		let allUsers = await User.find();

		//篩選掉自己與已是朋友的帳號
		let filterUsers = allUsers.filter((item) => {
			let isExist = true;

			authorFollowings.followings.forEach((i) => {
				if (item._id == i) {
					isExist *= false;
				} else {
					isExist *= true;
				}
			});
			return isExist;
		});
		res.status(200).json(filterUsers);
	} catch (err) {
		res.status(500).json(err);
	}
});

//search user
router.get('/search', async (req, res) => {
	const username = req.query.username;

	try {
		const user = await User.find({
			username: { $regex: username, $options: 'i' },
		});
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

//follow a user
router.put('/:id/follow', verify, async (req, res) => {
	//followers粉絲群
	//followings追蹤的目標
	if (req.body.userId !== req.params.id) {
		try {
			const currentUser = await User.findById(req.body.userId);
			const userBeFollow = await User.findById(req.params.id);

			if (!currentUser.followings.includes(req.params.id)) {
				await currentUser.updateOne({
					$push: { followings: req.params.id },
				});
				await userBeFollow.updateOne({
					$push: { followers: req.body.userId },
				});
				res.status(200).json('已加入追蹤');
			} else {
				res.status(400).json('您先前已追蹤此帳號');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(400).json('你不能追蹤自己');
	}
});

//unfollow a user
router.put('/:id/unfollow', verify, async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const currentUser = await User.findById(req.body.userId);
			const userBeFollow = await User.findById(req.params.id);

			if (currentUser.followings.includes(req.params.id)) {
				await currentUser.updateOne({
					$pull: { followings: req.params.id },
				});
				await userBeFollow.updateOne({
					$pull: { followers: req.body.userId },
				});
				res.status(200).json('已取消追蹤');
			} else {
				res.status(400).json('您並未追蹤此帳號');
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(400).json('你不能取消追蹤自己');
	}
});

//get friends
router.get('/friends/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const friends = await Promise.all(
			user.followings.map((friendId) => User.findById(friendId))
		);

		//建一個新的array 只拿取其中三個屬性
		let friendList = [];
		friends.map((friend) => {
			const { _id, username, profilePicture } = friend;
			friendList.push({ _id, username, profilePicture });
		});

		res.status(200).json(friendList);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
