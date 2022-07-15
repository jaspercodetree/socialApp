const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

const verify = require('../verify');

//create post
router.post('/', verify, async (req, res) => {
	try {
		const newPost = new Post(req.body);
		const post = await newPost.save();
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get a post
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//update post
router.put('/:id', verify, async (req, res) => {
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

			//如果貼文有圖，刪除資料夾內圖片
			if (post.img) {
				const fs = require('fs').promises;

				async function deleteFile(filePath) {
					try {
						await fs.unlink(filePath);
						console.log(`Deleted ${filePath}`);
					} catch (error) {
						console.error(
							`Got an error trying to delete the file: ${error.message}`
						);
					}
				}
				deleteFile(`./public/images/post/${post.img}`);
			}

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
router.put('/:id/like', verify, async (req, res) => {
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
router.put('/:id/addComment', verify, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $push: { comments: req.body.comment } });
		res.status(200).json('addComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//delete comment
router.put('/:id/deleteComment', verify, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $pull: { comments: req.body.comment } });
		res.status(200).json('deleteComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//edit comment
router.put('/:id/editComment', verify, async (req, res) => {
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
