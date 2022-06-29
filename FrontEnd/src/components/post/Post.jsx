import './post.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
//引入時間套件
import { format } from 'timeago.js';
import AlertDialog from '../alertDialog/AlertDialog';
import CommentItem from '../commentItem/CommentItem';
import { NearMeTwoTone } from '@material-ui/icons';

export default function Post({ originPost, setPosts }) {
	const [post, setPost] = useState(originPost);

	//A.此處user與useEffect的getUser 是指去獲得  好友圈內每一則post貼文的發文者user
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

		if (e.key === 'Enter') {
			//禁止enter換行
			e.preventDefault();

			//換行
			commentShareInput.current.value += '\n';

			//自適應高度;
			e.target.style.height = 'auto';
			e.target.style.height = `${e.target.scrollHeight}px`;
		} else if (isClick) {
			writeComment && sendCommentAjax();

			//恢復原有高度
			e.target.closest('div').firstChild.style.height = '25px';
			// console.log(e.target.closest('div').firstChild.style.height);
			//清空文字
			commentShareInput.current.value = '';
		}

		// if (e.shiftKey === true && e.key === 'Enter') {
		// 	//禁止enter換行
		// 	e.preventDefault();

		// 	//shift+enter換行
		// 	commentShareInput.current.value += '\n';

		// 	//自適應高度;
		// 	e.target.style.height = 'auto';
		// 	e.target.style.height = `${e.target.scrollHeight}px`;
		// } else if (isClick || e.key === 'Enter') {
		// 	//禁止enter換行
		// 	e.preventDefault();

		// 	writeComment && sendCommentAjax();
		// 	e.target.style.height = '25px';
		// 	commentShareInput.current.value = '';
		// }
	};

	const [comments, setComments] = useState();

	//comment sort
	useEffect(() => {
		//依創建時間排序
		setComments(
			post.comments.sort((p1, p2) => {
				if (
					new Date(p1.commentCreatedAt) >
					new Date(p2.commentCreatedAt)
				)
					return 1;
				if (
					new Date(p1.commentCreatedAt) <
					new Date(p2.commentCreatedAt)
				)
					return -1;
				return 0;
			})
		);
	}, [post.comments]);

	//edit post
	const postEditWrap = useRef();
	const postShareInput = useRef();

	const [writePost, setWritePost] = useState('');
	const [isPostEditable, setIsPostEditable] = useState(false);

	const editPost = async (e) => {
		// console.log(commentEditWrap.current);
		// commentListItemText.current.classList.add('d-none');
		// commentListItemTime.current.classList.add('d-none');
		postEditWrap.current.classList.remove('d-none');

		setIsPostEditable(true);

		const scrollHeight = postShareInput.current.scrollHeight;
		postShareInput.current.style.height = `${scrollHeight}px`;
	};

	const cancelEditPost = () => {
		postShareInput.current.value = post.desc;
		setIsPostEditable(false);
	};

	//send post
	const sendPost = (e, isClick) => {
		console.log(post);
		console.log(user);

		const _id = post._id;

		const sendPostAjax = async () => {
			try {
				await axios
					.put(`/posts/${_id}`, {
						userId: user._id,
						_id: _id,
						desc: writePost,
						isPostEditEver: true,
					})
					.then(async () => {
						const res = await axios.get(`/posts/${_id}`);
						setPost(res.data);
					});
			} catch (err) {
				console.log(err);
			}
		};

		if (e.key === 'Enter') {
			//禁止enter換行
			e.preventDefault();

			//換行
			postShareInput.current.value += '\n';

			//自適應高度;
			e.target.style.height = 'auto';
			e.target.style.height = `${e.target.scrollHeight}px`;
		} else if (isClick) {
			writePost && sendPostAjax();

			//關閉編輯視窗
			setIsPostEditable(false);
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
										src={PF + post.emojiImg}
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
						<span className="postDate ms-0">
							{format(post.createdAt)}
						</span>
						{post.isPostEditEver && (
							<span className="postEditTime ms-2">已編輯</span>
						)}
					</div>
					{post.userId === currentUser._id && (
						<div className="postTopRight">
							<AlertDialog
								post={post}
								editPost={editPost}
								setPosts={setPosts}
							/>
						</div>
					)}
				</div>
				<div
					className={`postCenter d-flex flex-column ${
						isPostEditable ? 'postCenterEditable' : ''
					}`}
				>
					{post.desc && (
						<h6
							className={`postText m-0 ${
								isPostEditable ? 'd-none' : ''
							}`}
							dangerouslySetInnerHTML={{
								__html: post.desc.replace(/\n|\r\n/g, '<br>'),
							}}
						></h6>
					)}
					{post.img && (
						<img
							src={PF + `post/` + post.img}
							alt=""
							className={`postImg ${post.desc ? 'mt-3' : 'm-0'} ${
								isPostEditable ? 'd-none' : ''
							}`}
						/>
					)}

					<div
						className={`postShareWrap postEditWrap px-3 py-2 position-relative ${
							isPostEditable ? '' : 'd-none'
						}`}
						ref={postEditWrap}
					>
						<textarea
							rows="1"
							className="postShareInput"
							onChange={(e) => {
								setWritePost(postShareInput.current.value);

								//自適應高度
								e.target.style.height = 'auto';
								e.target.style.height = `${e.target.scrollHeight}px`;
							}}
							onKeyDown={(e) => {
								sendPost(e);
							}}
							ref={postShareInput}
							defaultValue={post.desc}
						></textarea>
						<button
							type="button"
							name="sendPostBtn"
							id="sendPostBtn"
							className={`bg-transparent border-0 position-absolute end-0 me-4 ${
								postShareInput !== '' ? '' : 'disabled'
							}`}
							onClick={(e) => sendPost(e, true)}
						>
							<NearMeTwoTone />
						</button>
					</div>
					<div className="postEditCancelWrap mt-3">
						<span
							className={`postEditCancel text-primary text-decoration-underline  ${
								isPostEditable ? '' : 'd-none'
							}`}
							onClick={cancelEditPost}
						>
							取消
						</span>
					</div>
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
									setWriteComment(
										commentShareInput.current.value
									);

									//自適應高度;
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
								className={`bg-transparent border-0 position-absolute end-0 me-4 ${
									writeComment !== '' ? '' : 'disabled'
								}`}
								onClick={(e) => sendComment(e, true)}
							>
								<NearMeTwoTone />
							</button>
						</div>
					</div>
					<div className="commentList">
						{comments &&
							comments.map((comment) => {
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
