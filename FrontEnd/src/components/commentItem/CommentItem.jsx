/* 一則回覆 << father: post */
import './commentItem.css';
import axios from 'axios';
import React, { useRef } from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'timeago.js';
import { MoreHoriz, NearMeTwoTone } from '@material-ui/icons';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import axiosJWT from '../../AxiosJWTConfig';

const CommentItem = ({
	comment,
	postId,
	getNewPost,
	allUserInfoForComment,
}) => {
	const { user, PF, setIsLoading } = useContext(AuthContext);
	// console.log(allUserInfoForComment);
	// console.log(allUserInfoForComment['60e553e65cd1772ce8f1e3ea'].username);

	const [commentUsername, setCommentUsername] = useState();
	const [commentProfilePic, setCommentProfilePic] = useState();

	//update comment username & profilePic
	useEffect(() => {
		if (Object.keys(allUserInfoForComment).length) {
			setCommentUsername(
				allUserInfoForComment[`${comment.commentUserId}`].username
			);
			setCommentProfilePic(
				allUserInfoForComment[`${comment.commentUserId}`].profilePicture
			);
		}
	}, [allUserInfoForComment, comment.commentUserId]);

	const deleteComment = async () => {
		setOpen(false);
		setIsLoading(true);

		await axiosJWT
			.put(`/posts/${postId}/deleteComment`, {
				comment: {
					_id: comment._id,
				},
			})
			.then(async () => {
				const res = await axios.get(`/posts/${postId}`);
				getNewPost(res.data);
			})
			.catch((err) => {
				console.log(err);
			});

		setIsLoading(false);
	};

	const editComment = async (e) => {
		// console.log(commentEditWrap.current);
		// commentListItemText.current.classList.add('d-none');
		// commentListItemTime.current.classList.add('d-none');
		commentEditWrap.current.classList.remove('d-none');

		setIsEditable(true);

		const scrollHeight = commentShareInput.current.scrollHeight;
		commentShareInput.current.style.height = `${scrollHeight}px`;
	};

	const cancelEditComment = () => {
		commentShareInput.current.value = comment.commentText;
		setIsEditable(false);
	};

	//Modal close outside
	// Create a ref that we add to the element for which we want to detect outside clicks
	const ref = useRef();
	// State for our modal
	const [isModalOpen, setModalOpen] = useState(false);
	// Call hook passing in the ref and a function to call on outside click
	useOnClickOutside(ref, () => setModalOpen(false));

	function useOnClickOutside(ref, handler) {
		useEffect(
			() => {
				const listener = (event) => {
					// Do nothing if clicking ref's element or descendent elements
					if (!ref.current || ref.current.contains(event.target)) {
						return;
					}
					handler(event);
				};
				document.addEventListener('mousedown', listener);
				document.addEventListener('touchstart', listener);
				return () => {
					document.removeEventListener('mousedown', listener);
					document.removeEventListener('touchstart', listener);
				};
			},
			// Add ref and handler to effect dependencies
			// It's worth noting that because passed in handler is a new ...
			// ... function on every render that will cause this effect ...
			// ... callback/cleanup to run every render. It's not a big deal ...
			// ... but to optimize you can wrap handler in useCallback before ...
			// ... passing it into this hook.
			[ref, handler]
		);
	}

	//edit comment
	const [writeComment, setWriteComment] = useState('');
	const commentShareInput = useRef();

	const [isEditable, setIsEditable] = useState(false);

	const commentListItemText = useRef();
	const commentListItemTime = useRef();
	const commentEditWrap = useRef();

	//send comment
	const sendComment = (e, isClick) => {
		const _id = comment._id;

		const sendCommentAjax = async () => {
			// commentListItemText.current.classList.remove('d-none');
			// commentListItemTime.current.classList.remove('d-none');
			// commentEditWrap.current.classList.add('d-none');

			try {
				setIsLoading(true);

				await axiosJWT
					.put(`/posts/${postId}/editComment`, {
						comment: {
							_id: _id,
							commentUserId: user._id,
							// commentUsername: user.username,
							// commentProfilePic: user.profilePicture,
							commentText: writeComment,
							commentCreatedAt: comment.commentCreatedAt,
							commentEditAt: new Date(),
						},
					})
					.then(async () => {
						const res = await axios.get(`/posts/${postId}`);
						getNewPost(res.data);
					});

				setIsLoading(false);
			} catch (err) {
				console.log(err);
			}
		};

		if (e.key === 'Enter') {
			//自適應高度;
			e.target.style.height = 'auto';
			e.target.style.height = `${e.target.scrollHeight}px`;
		} else if (isClick) {
			writeComment && sendCommentAjax();

			//關閉編輯視窗
			setIsEditable(false);
		}
	};

	//刪除確認
	const [open, setOpen] = useState(false);

	return (
		<div className="commentListItem">
			<div className="commentListLeft">
				<Link to={`/profile/${commentUsername}`}>
					<img
						src={
							commentProfilePic
								? PF + `person/${commentProfilePic}`
								: PF + `person/noAvatar.png`
						}
						alt=""
						className="commentListImg"
					/>
				</Link>
			</div>
			<div className="commentListRight px-3 py-2">
				<Link to={`/profile/${commentUsername}`}>
					<h6 className="commentListItemUser fw-bold mb-1">
						{commentUsername}
					</h6>
				</Link>
				{comment.commentText && (
					<h6
						className={`commentListItemText m-0 ${
							isEditable ? 'd-none' : ''
						}`}
						dangerouslySetInnerHTML={{
							__html: comment.commentText.replace(
								/\n|\r\n/g,
								'<br>'
							),
						}}
						ref={commentListItemText}
					></h6>
				)}
				<h6
					className={`commentListItemTime m-0 ${
						isEditable ? 'd-none' : ''
					}`}
					ref={commentListItemTime}
				>
					{format(comment.commentCreatedAt)}

					{comment.commentEditAt && (
						<span className="commentEditTime ms-2">已編輯</span>
					)}
				</h6>
				<div
					className={`commentShareRight commentEditWrap px-3 py-2 position-relative ${
						isEditable ? '' : 'd-none'
					}`}
					ref={commentEditWrap}
				>
					<textarea
						rows="1"
						className="commentShareInput"
						onChange={(e) => {
							setWriteComment(commentShareInput.current.value);

							//自適應高度
							e.target.style.height = 'auto';
							e.target.style.height = `${e.target.scrollHeight}px`;
						}}
						onKeyDown={(e) => {
							sendComment(e);
						}}
						ref={commentShareInput}
						defaultValue={comment.commentText}
					></textarea>
					<button
						type="button"
						name="sendCommentBtn"
						id="sendCommentBtn"
						className={`bg-transparent border-0 position-absolute end-0 me-4 ${
							commentShareInput !== '' ? '' : 'disabled'
						}`}
						onClick={(e) => sendComment(e, true)}
					>
						<NearMeTwoTone />
					</button>
				</div>
				<span
					className={`commentEditCancel w-100 text-center text-primary text-decoration-underline pt-2 ${
						isEditable ? '' : 'd-none'
					}`}
					onClick={cancelEditComment}
				>
					取消
				</span>
			</div>
			<div
				className={`commentListRightBtn position-relative ${
					comment.commentUserId === user._id && 'currentUserComment'
				}`}
			>
				<button
					name="commentMoreBtn"
					id="commentMoreBtn"
					className="btn btn-sm rounded-circle invisible px-1 ms-2"
					onClick={() => {
						setModalOpen(true);
					}}
				>
					<MoreHoriz></MoreHoriz>
				</button>

				<div
					ref={ref}
					className={`commentEditModal position-absolute p-2 ${
						isModalOpen ? '' : 'd-none'
					}`}
					onClick={(e) => {
						setModalOpen(false);
					}}
				>
					<button
						name="commentEditBtn"
						id="commentEditBtn"
						className="btn"
						onClick={(e) => editComment(e)}
					>
						編輯留言
					</button>
					<button
						name="commentDeleteBtn"
						id="commentDeleteBtn"
						className="btn"
						onClick={() => setOpen(true)}
					>
						刪除留言
					</button>
				</div>
				<Dialog open={open} onClose={() => setOpen(false)}>
					<DialogTitle
						id="alert-dialog-title"
						className="pb-0 text-danger"
					>
						{'刪除此則留言 ?'}
					</DialogTitle>
					<DialogActions className="justify-content-center">
						<Button onClick={() => setOpen(false)} color="default">
							取消
						</Button>
						<Button
							onClick={deleteComment}
							color="default"
							autoFocus
						>
							確定
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
};

export default CommentItem;
