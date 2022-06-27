import './post.css';
// import { Users } from '../../dummyData';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
//引入時間套件
import { format } from 'timeago.js';
import AlertDialog from '../alertDialog/AlertDialog';
import CommentItem from '../commentItem/CommentItem';
import { NearMeTwoTone } from '@material-ui/icons';

export default function Post({ originPost }) {
	const [post, setPost] = useState(originPost);

	//A.此處user與useEffect的getuser 是指去獲得  好友圈內每一則post貼文的發文者user
	const [user, setUser] = useState({});

	//B.like相關
	//此處user 由於與A處的名稱重複，因此我們起一個暱稱currentUser代替，currentUser代表的是登入的使用者資料
	const { user: currentUser, PF } = useContext(AuthContext);
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);

	const [writeComment, setWriteComment] = useState('');
	const commentShareInput = useRef();

	const [tagUserName, setTagUserName] = useState('');

	//A.
	useEffect(() => {
		const getUser = async () => {
			const res = await axios.get(`/users?userId=${post.userId}`);
			setUser(res.data);
		};
		getUser();
	}, [post.userId]);

	//B.
	useEffect(() => {
		setIsLiked(post.likes.includes(currentUser._id));
	}, [currentUser._id, post.likes]);

	const likeHandler = () => {
		try {
			axios.put('/posts/' + post._id + '/like', {
				userId: currentUser._id,
			});
		} catch (err) {
			console.log(err);
		}

		isLiked ? setLike(like - 1) : setLike(like + 1);
		setIsLiked(!isLiked);
	};

	//get tagUserName
	useEffect(() => {
		const getTagUserName = async () => {
			await axios
				.get(`/users?userId=${post.tagUserId}`)
				.then((res) => setTagUserName(res.data.username))
				.catch((err) => console.log(err));
		};
		post.tagUserId && getTagUserName();
	}, [post.tagUserId]);

	//send comment
	const sendComment = (e, isClick) => {
		const sendCommentAjax = async () => {
			try {
				//generate guid
				function _uuid() {
					var d = Date.now();
					if (
						typeof performance !== 'undefined' &&
						typeof performance.now === 'function'
					) {
						d += performance.now(); //use high-precision timer if available
					}
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
						/[xy]/g,
						function (c) {
							var r = (d + Math.random() * 16) % 16 | 0;
							d = Math.floor(d / 16);
							return (c === 'x' ? r : (r & 0x3) | 0x8).toString(
								16
							);
						}
					);
				}
				const _id = _uuid();

				await axios
					.put(`/posts/${post._id}/addComment`, {
						comment: {
							_id: _id,
							commentUserId: currentUser._id,
							commentUsername: currentUser.username,
							commentProfilePic: currentUser.profilePicture,
							commentText: writeComment,
							commentCreatedAt: new Date(),
						},
					})
					.then(async () => {
						const res = await axios.get(`/posts/${post._id}`);
						setPost(res.data);
						setWriteComment('');
					});
			} catch (err) {
				console.log(err);
			}
		};

		if (e.key === 'Enter' || isClick) {
			writeComment && sendCommentAjax();

			//禁止enter換行
			e.preventDefault();
			commentShareInput.current.value = '';
		}
	};

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<Link to={`/profile/${user.username}`}>
							<img
								src={
									user.profilePicture
										? PF + `person/${user.profilePicture}`
										: PF + `person/noAvatar.png`
								}
								alt=""
								className="postProfileImg"
							/>
						</Link>
						<span className="postUsername">{user.username}</span>
						{post.emojiImg && (
							<span className="emojiWrapper">
								<span className="postEmojiImg">
									正在
									<img
										className="mx-1 "
										src={post.emojiImg}
										alt=""
									/>
								</span>
								<span>
									覺得
									<span className="postEmojiText fw-bold mx-1">
										{post.emojiText}。
									</span>
								</span>
							</span>
						)}
						{post.tagUserId && (
							<span className="tagUserWrapper">
								<span>
									──和
									<Link to={`/profile/${tagUserName}`}>
										<span className="tagUserName fw-bold ms-2">
											{tagUserName}
										</span>
									</Link>
									。
								</span>
							</span>
						)}
						<span className="postDate ms-2">
							{format(post.createdAt)}
						</span>
					</div>
					{post.userId === currentUser._id && (
						<div className="postTopRight">
							<AlertDialog post={post} />
						</div>
					)}
				</div>
				<div className="postCenter">
					<span className="postText">{post.desc}</span>
					<img
						src={post.img ? PF + `post/` + post.img : ''}
						alt=""
						className="postImg"
					/>
				</div>
				<div className="postBottom">
					<div className="postBottomLeft">
						<img
							src={`${PF}like.png`}
							alt=""
							className="likeIcon"
							onClick={likeHandler}
						/>
						<img
							src={`${PF}heart.png`}
							alt=""
							className="likeIcon"
							onClick={likeHandler}
						/>
						<span className="postLikeCounter">{like}個人喜歡</span>
					</div>
					{/* <div className="postBottomRight">
						<div className="postCommentText">留言</div>
					</div> */}
				</div>
				<div className="postComment">
					<div className="commentShare">
						<div className="commentShareLeft">
							<img
								src={
									currentUser.profilePicture
										? PF +
										  `person/${currentUser.profilePicture}`
										: PF + `person/noAvatar.png`
								}
								alt=""
								className="commentShareImg"
							/>
						</div>
						<div className="commentShareRight px-3 py-2 position-relative">
							<textarea
								rows="1"
								className="commentShareInput"
								placeholder={`留言......`}
								onChange={(e) => {
									setWriteComment(e.target.value);

									//自適應高度
									// console.log(
									// 	e.target.style.height,
									// 	e.target.scrollHeight
									// );
									e.target.style.height = 'auto';
									e.target.style.height = `${e.target.scrollHeight}px`;
								}}
								onKeyDown={(e) => {
									sendComment(e);
								}}
								ref={commentShareInput}
							></textarea>
							<button
								type="button"
								name="sendCommentBtn"
								id="sendCommentBtn"
								className="bg-transparent border-0 position-absolute end-0 me-4"
								onClick={(e) => sendComment(e, true)}
							>
								<NearMeTwoTone />
							</button>
						</div>
					</div>
					<div className="commentList">
						{post.comments.map((comment) => {
							return (
								<CommentItem
									key={comment._id}
									comment={comment}
									postId={post._id}
									getNewPost={setPost}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
