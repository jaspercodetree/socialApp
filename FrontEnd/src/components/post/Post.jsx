/* 一則貼文post >> children:commentItem */
import './post.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
//引入時間套件
import { format } from 'timeago.js';
import AlertDialog from '../alertDialog/AlertDialog';
import CommentItem from '../commentItem/CommentItem';
import { Cancel, NearMeTwoTone, PermMedia } from '@material-ui/icons';
import axiosJWT from '../../AxiosJWTConfig';
import { checkAndSetFile } from '../../checkAndSetFile';

export default function Post({
	originPost,
	setPosts,
	allUserInfoForComment,
	username,
}) {
	const [post, setPost] = useState(originPost);

	//like
	//此處user 起一個暱稱currentUser代替，currentUser代表的是登入的使用者資料
	const { user, PF } = useContext(AuthContext);
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);

	const [writeComment, setWriteComment] = useState('');
	const commentShareInput = useRef();

	const [tagUserName, setTagUserName] = useState('');

	useEffect(() => {
		setIsLiked(post.likes.includes(user._id));
	}, [user._id, post.likes]);

	const likeHandler = async () => {
		await axiosJWT
			.put('/posts/' + post._id + '/like', {
				userId: user._id,
			})
			.then(() => {
				isLiked ? setLike(like - 1) : setLike(like + 1);
				setIsLiked(!isLiked);
			})
			.catch((err) => console.log(err));
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

				await axiosJWT
					.put(`/posts/${post._id}/addComment`, {
						comment: {
							_id: _id,
							commentUserId: user._id,
							commentUsername: user.username,
							commentProfilePic: user.profilePicture,
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

	//2.Edit post
	const postEditWrap = useRef();
	const postShareInput = useRef();
	const [isPostEditable, setIsPostEditable] = useState(false);

	//原有圖片("檔案名")
	const [originPostImg, setOriginPostImg] = useState(post.img);
	//新上傳圖片("blob")
	const [filePostImg, setFilePostImg] = useState(null);

	//顯示編輯區
	const editPost = async (e) => {
		postEditWrap.current.classList.remove('d-none');

		setIsPostEditable(true);

		//自適應textarea
		const scrollHeight = postShareInput.current.scrollHeight;
		postShareInput.current.style.height = `${scrollHeight}px`;
	};

	//取消編輯
	const cancelEditPost = () => {
		//原文字與圖片
		postShareInput.current.value = post.desc;
		setOriginPostImg(post.img);

		//關閉編輯區
		setIsPostEditable(false);
		//清空blob圖片
		setFilePostImg(null);
	};

	//完成送出 send Edit Post
	const sendPost = (e, isClick) => {
		const _id = post._id;

		const sendPostAjax = async () => {
			e.preventDefault();

			//更新資料
			const updateData = {
				userId: post.userId,
				_id: _id,
				desc: postShareInput.current.value,
				isPostEditEver: true,
				img: originPostImg,
			};

			if (filePostImg) {
				//新上傳post圖片
				const data = new FormData();
				const filename = Date.now() + filePostImg.name;
				data.append('name', filename);
				data.append('file', filePostImg);

				updateData.img = filename;

				try {
					//新增圖片到資料夾
					await axiosJWT.post('/upload', data);
					//刪除資料夾原先的圖片
					await axiosJWT.post(`/img/delete`, {
						filename: `post/${post.img}`,
					});

					//更新originPostImg 為新上傳檔案名
					setOriginPostImg(filename);
				} catch (error) {
					console.log(error);
				}
			} else if (post.img && updateData.img === '') {
				//刪除資料夾原先的圖片
				await axiosJWT.post(`/img/delete`, {
					filename: `post/${post.img}`,
				});
				console.log(updateData);
			}

			//更新資料庫
			try {
				await axiosJWT
					.put(`/posts/${_id}`, updateData)
					.then(async () => {
						//重新獲取posts
						const res = await axios.get(`/posts/${_id}`);
						setPost(res.data);

						//清空blob圖片
						setFilePostImg(null);

						//關閉編輯區
						setIsPostEditable(false);
					});
			} catch (err) {
				console.log(err);
			}
		};

		//入口程式
		if (e.key === 'Enter') {
			//禁止enter換行
			e.preventDefault();

			//換行
			postShareInput.current.value += '\n';

			//textarea自適應高度;
			e.target.style.height = 'auto';
			e.target.style.height = `${e.target.scrollHeight}px`;
		} else if (isClick) {
			//1.有文字 或 2.有原圖片 或 3.有新圖片
			(postShareInput.current.value || originPostImg || filePostImg) &&
				sendPostAjax();
		}
	};

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft flex-wrap">
						<Link to={`/profile/${post.username}`}>
							<img
								src={
									post.profilePicture
										? PF + `person/${post.profilePicture}`
										: PF + `person/noAvatar.png`
								}
								alt=""
								className="postProfileImg"
							/>
						</Link>
						<span className="postUsername">{post.username}</span>
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
					{post.userId === user._id && (
						<div className="postTopRight">
							<AlertDialog
								post={post}
								editPost={editPost}
								setPosts={setPosts}
								username={username}
							/>
						</div>
					)}
				</div>
				<div
					className={`postCenter d-flex flex-column ${
						isPostEditable ? 'postCenterEditable' : ''
					}`}
				>
					{/* 檢視 */}
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

					{/* 編輯 */}
					<div
						className={`postShareWrap postEditWrap px-3 py-2 position-relative ${
							isPostEditable ? '' : 'd-none'
						}`}
						ref={postEditWrap}
					>
						<div className="w-100">
							<textarea
								rows="1"
								className="postShareInput"
								onChange={(e) => {
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

							{/* post img */}
							<div className="w-75">
								{/* 此處若input id非唯一，會造成上傳檔案只在第一則post顯示，因此改id */}
								<label
									htmlFor={`uploadPostFile_${post._id}`}
									className={` ${
										isPostEditable
											? 'd-inline-block'
											: 'd-none'
									} uploadPostFileLabel mt-1`}
								>
									<PermMedia
										htmlColor="tomato"
										className=" me-1"
									/>

									<input
										style={{ display: 'none' }}
										type="file"
										name={`uploadPostFile_${post._id}`}
										id={`uploadPostFile_${post._id}`}
										className={``}
										accept=".png, .jpg, .jpeg, .gif"
										onChange={(e) => {
											checkAndSetFile(e.target) &&
												setFilePostImg(
													e.target.files[0]
												);
										}}
									/>
								</label>
								{(originPostImg || filePostImg) && (
									<Cancel
										className="cancelPostImg ms-1"
										onClick={(e) => {
											setOriginPostImg('');
											setFilePostImg(null);
										}}
									/>
								)}

								{/* 圖片預覽 */}
								<div
									className={`shareImgContainer mt-1 ${
										originPostImg || filePostImg
											? ''
											: 'd-none'
									}`}
								>
									<div className="shareImgWrap position-relative">
										{filePostImg ? (
											<>
												<img
													className="postUserImgPreview w-100"
													src={URL.createObjectURL(
														filePostImg
													)}
													alt=""
												/>
											</>
										) : (
											<img
												className="postUserImgPreview w-100"
												src={
													post.img &&
													PF + `post/` + post.img
												}
												alt=""
											/>
										)}
									</div>
								</div>
							</div>
						</div>

						<button
							type="button"
							name="sendPostBtn"
							id="sendPostBtn"
							className={`bg-transparent border-0 position-absolute end-0 me-4 ${
								(postShareInput.current &&
									postShareInput.current.value) ||
								originPostImg ||
								filePostImg
									? ''
									: 'disabled'
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
						{/* <img
							src={`${PF}like.png`}
							alt=""
							className="likeIcon"
							onClick={likeHandler}
						/> */}
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
									user.profilePicture
										? PF + `person/${user.profilePicture}`
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
										allUserInfoForComment={
											allUserInfoForComment
										}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}
