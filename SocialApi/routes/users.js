const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//update
router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id) {
		//將要修改的密碼加密
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}

		//找到此使用者 更新資料
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
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
router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id) {
		try {
			await User.findOneAndDelete(req.body.userId);
			res.status(200).json('帳號已刪除');
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(400).json('你只能刪除自己的帳號');
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

//follow
router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const currentUser = await User.findById(req.body.userId);
			const userBeFollow = await User.findById(req.params.id);

			if (!userBeFollow.followers.includes(req.body.userId)) {
				await userBeFollow.updateOne({
					$push: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { followings: req.params.id },
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

//unfollow
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const currentUser = await User.findById(req.body.userId);
			const userBeFollow = await User.findById(req.params.id);

			if (userBeFollow.followers.includes(req.body.userId)) {
				await userBeFollow.updateOne({
					$pull: { followers: req.body.userId },
				});
				await currentUser.updateOne({
					$pull: { followings: req.params.id },
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
		const friendsIdAry = user.followings;
		const friends = await Promise.all(
			friendsIdAry.map((friendId) => User.findById(friendId))
		);

		//建一個新的array 只拿取其中三個屬性
		const friendList = [];
		friends.map((friend) => {
			const { _id, username, profilePicture } = friend;
			friendList.push({ _id, username, profilePicture });
		});

		return res.status(200).json(friendList);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
