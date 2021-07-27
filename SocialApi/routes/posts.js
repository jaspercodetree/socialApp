const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

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
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (req.body.userId === post.userId) {
			post.deleteOne();
			res.status(200).json('此篇貼文已被刪除');
		} else {
			res.status(400).json('你只能刪除自己的貼圖');
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
			post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('已經對貼文退讚');
		} else {
			post.updateOne({ $push: { likes: req.body.userId } });
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
		const timelinePosts = currentUserPosts.concat(friendPosts);
		res.status(200).json(timelinePosts);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
