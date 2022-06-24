import './commentItem.css';
import axios from 'axios';
import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'timeago.js';

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
				<h6 className="commentListItemText fw-bold mb-1">
					{comment.commentUsername}
				</h6>
				<h6 className="commentListItemText m-0">
					{comment.commentText}
				</h6>
				<h6 className="commentListItemTime m-0">
					{format(comment.commentCreatedAt)}
				</h6>
			</div>
			<div
				className={`commentListRightBtn ${
					comment.commentUserId === user._id && 'currentUserComment'
				}`}
			>
				<button
					name="commentDeleteBtn"
					id="commentDeleteBtn"
					className="btn btn-danger btn-sm invisible ms-2"
					onClick={(e) => deleteComment()}
				>
					X
				</button>
			</div>
		</div>
	);
};

export default CommentItem;
