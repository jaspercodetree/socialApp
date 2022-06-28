const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

//JWT verify
const verify = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, 'mySecretKey', (err, user) => {
			if (err) {
				return res.status(403).json('Token is not valid!');
			}

			req.user = user;
			next();
		});
	} else {
		res.status(401).json('You are not authenticated!');
	}
};

//create
router.post('/', async (req, res) => {
	try {
		const newPost = new Post(req.body);
		const post = await newPost.save();
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//update
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (req.body.userId === post.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('您的貼文已經修改完成');
		} else {
			res.status(400).json('你只能修改自己的貼文');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//delete
router.delete('/:id/', verify, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (req.body.userId === post.userId) {
			post.deleteOne();
			res.status(200).json('此篇貼文已被刪除');
		} else {
			res.status(400).json('你只能刪除自己的貼文');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//其他功能

//like & dislike
router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.likes.includes(req.body.userId)) {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('已經對貼文退讚');
		} else {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('已經對貼文按讚');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//貼文牆 (自己與已追蹤followings的好友)
router.get('/timeline/:id', async (req, res) => {
	try {
		//自己的貼文
		const currentUserPosts = await Post.find({ userId: req.params.id });

		//朋友的貼文
		const currentUser = await User.findById(req.params.id);
		const followingsUserIds = await currentUser.followings; //array
		const friendPosts = await Promise.all(
			followingsUserIds.map((friendId) => Post.find({ userId: friendId }))
		);

		//合併兩個陣列,所有貼文
		//此處要用展開運算符，才能只拿出friendPosts陣列裡面的資料合併
		const timelinePosts = currentUserPosts.concat(...friendPosts);
		res.status(200).json(timelinePosts);
	} catch (err) {
		res.status(500).json(err);
	}
});

//個人頁面 (自己所有貼文)
router.get('/profile/:username', async (req, res) => {
	try {
		const currentUser = await User.findOne({
			username: req.params.username,
		});
		const posts = await Post.find({ userId: currentUser._id });

		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
});

//add comment
router.put('/:id/addComment', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $push: { comments: req.body.comment } });
		res.status(200).json('addComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//delete comment
router.put('/:id/deleteComment', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $pull: { comments: req.body.comment } });
		res.status(200).json('deleteComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//edit comment
router.put('/:id/editComment', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({
			$pull: { comments: { _id: req.body.comment._id } },
		});
		await post.updateOne({
			$push: { comments: req.body.comment },
		});
		res.status(200).json('editComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
