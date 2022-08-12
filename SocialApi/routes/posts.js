const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

const verify = require('../verify');

//postPost
router.post('/', verify, async (req, res) => {
	try {
		const newPost = new Post(req.body);
		const post = await newPost.save();
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//getPost
router.get('/:id', async (req, res) => {
	try {
		//a.1 貼文
		const post = await Post.findById(req.params.id);
		const postUserId = post.userId;
		// console.log(post._doc);

		//a.2 貼文個人資料
		const postUserInfo = await User.find(
			{ _id: postUserId },
			{
				username: 1,
				profilePicture: 1,
			}
		);
		// console.log(postUserInfo[0]._doc);

		//a.3 結合a.1&a.2
		let newPostUserPosts = Object.assign(
			{},
			postUserInfo[0]._doc,
			post._doc
		);
		// console.log(newPostUserPosts);

		res.status(200).json(newPostUserPosts);
	} catch (err) {
		res.status(500).json(err);
	}
});

//putPost
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

//deletePost
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

//postLikeDislike
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

//getTimeline 貼文牆 (自己與已追蹤followings的好友 所有推文)
router.get('/timeline/:id', async (req, res) => {
	try {
		//a.自己的貼文
		//a.1 自己的個人資料
		const currentUserInfo = await User.find(
			{ _id: req.params.id },
			{
				username: 1,
				profilePicture: 1,
				followings: 1,
			}
		);
		// console.log(currentUserInfo);

		//a.2 自己的所有貼文
		const currentUserPosts = await Post.find({ userId: req.params.id });
		// console.log(currentUserPosts);

		//a.3 結合a.1&a.2
		let newCurrentUserPosts = [];
		currentUserPosts.forEach((item) => {
			// console.log(item._doc);
			// console.log(currentUserPosts[0]._doc);

			newCurrentUserPosts.push(
				Object.assign({}, currentUserInfo[0]._doc, item._doc)
			);
		});
		// console.log(newCurrentUserPosts);

		//b.朋友的貼文
		//所有朋友的id array
		const followingsUserIds = currentUserInfo[0].followings;

		let followingsUserPost;
		let followingsUserInfo;
		let newFollowingsUserPost = [];

		//由於要同步處理，因此使用for await
		const getFriendPosts = async () => {
			for await (const friendId of followingsUserIds) {
				//b.1.朋友個人資訊
				followingsUserInfo = await User.find(
					{ _id: friendId },
					{
						username: 1,
						profilePicture: 1,
						followings: 1,
					}
				);
				// console.log(followingsUserInfo);

				//b.2.朋友所有貼文
				followingsUserPost = await Post.find({ userId: friendId });
				// console.log(followingsUserPost);

				//b.3.結合b.1&b.2的新陣列
				followingsUserPost.forEach((item) => {
					// console.log(item._doc);
					// console.log(followingsUserInfo[0]._doc);

					newFollowingsUserPost.push(
						Object.assign({}, followingsUserInfo[0]._doc, item._doc)
					);
				});
			}
			// console.log(newFollowingsUserPost);

			//c.合併a&b陣列,得到自己與朋友的所有貼文
			const timelinePosts = newCurrentUserPosts.concat(
				newFollowingsUserPost
			);
			// console.log(timelinePosts);

			res.status(200).json(timelinePosts);
		};
		getFriendPosts();
	} catch (err) {
		res.status(500).json(err);
	}
});

//getPersonalPost 個人頁面 (個人所有貼文)
router.get('/profile/:username', async (req, res) => {
	try {
		//a.自己的貼文
		//a.1 自己的個人資料
		const currentUserInfo = await User.find(
			{ username: req.params.username },
			{
				username: 1,
				profilePicture: 1,
			}
		);
		// console.log(currentUserInfo);

		//a.2 自己的所有貼文
		const currentUserPosts = await Post.find({
			userId: currentUserInfo[0]._id,
		});
		// console.log(currentUserPosts);

		//a.3 結合a.1&a.2
		let newCurrentUserPosts = [];
		currentUserPosts.forEach((item) => {
			// console.log(item._doc);
			// console.log(currentUserPosts[0]._doc);

			newCurrentUserPosts.push(
				Object.assign({}, currentUserInfo[0]._doc, item._doc)
			);
		});
		// console.log(newCurrentUserPosts);

		res.status(200).json(newCurrentUserPosts);
	} catch (err) {
		res.status(500).json(err);
	}
});

//postComment
router.put('/:id/addComment', verify, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $push: { comments: req.body.comment } });
		res.status(200).json('addComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//deleteComment
router.put('/:id/deleteComment', verify, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		await post.updateOne({ $pull: { comments: req.body.comment } });
		res.status(200).json('deleteComment success');
	} catch (err) {
		res.status(500).json(err);
	}
});

//putComment
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
