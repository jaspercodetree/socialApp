import './commentItem.css';
import axios from 'axios';
import React, { useRef } from 'react';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'timeago.js';
import { MoreHoriz, NearMeTwoTone } from '@material-ui/icons';

const CommentItem = ({ comment, postId, getNewPost }) => {
	const { user, PF } = useContext(AuthContext);

	const deleteComment = async () => {
		await axios
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
				await axios
					.put(`/posts/${postId}/editComment`, {
						comment: {
							_id: _id,
							commentUserId: user._id,
							commentUsername: user.username,
							commentProfilePic: user.profilePicture,
							commentText: writeComment,
							commentCreatedAt: comment.commentCreatedAt,
							commentEditAt: new Date(),
						},
					})
					.then(async () => {
						const res = await axios.get(`/posts/${postId}`);
						getNewPost(res.data);
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

			//關閉編輯視窗
			setIsEditable(false);
		}
	};

	return (
		<div className="commentListItem">
			<div className="commentListLeft">
				<Link to={`/profile/${comment.commentUsername}`}>
					<img
						src={
							comment.commentProfilePic
								? PF + `person/${comment.commentProfilePic}`
								: PF + `person/noAvatar.png`
						}
						alt=""
						className="commentListImg"
					/>
				</Link>
			</div>
			<div className="commentListRight px-3 py-2">
				<Link to={`/profile/${comment.commentUsername}`}>
					<h6 className="commentListItemUser fw-bold mb-1">
						{comment.commentUsername}
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
					className={`commentEditCancel text-primary text-decoration-underline ps-3 pt-1 ${
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
						onClick={() => deleteComment()}
					>
						刪除留言
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommentItem;
