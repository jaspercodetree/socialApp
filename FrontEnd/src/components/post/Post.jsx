import './post.css';
// import { Users } from '../../dummyData';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
//引入時間套件
import { format } from 'timeago.js';
import AlertDialog from '../alertDialog/AlertDialog';

export default function Post({ post }) {
	//A.此處user與useEffect的getuser 是指去獲得  好友圈內每一則post貼文的發文者user
	const [user, setUser] = useState({});

	//B.like相關
	//此處user 由於與A處的名稱重複，因此我們起一個暱稱currentUser代替，currentUser代表的是登入的使用者資料
	const { user: currentUser, PF } = useContext(AuthContext);
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);

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
						<span className="postDate">
							{format(post.createdAt)}
						</span>
					</div>
					<div className="postTopRight">
						<AlertDialog post={post} />
					</div>
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
					<div className="postBottomRight">
						<div className="postCommentText">留言</div>
					</div>
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
						<div className="commentShareRight">
							<input
								type="text"
								className="commentShareInput"
								placeholder={`留言......`}
							/>
						</div>
					</div>
					<div className="commentList">
						<div className="commentListItem">
							<div className="commentListLeft">
								<img
									src={
										user.profilePicture
											? PF +
											  `person/${user.profilePicture}`
											: PF + `person/noAvatar.png`
									}
									alt=""
									className="commentListImg"
								/>
							</div>
							<div className="commentListRight">
								<h5 className="commentListItemText">讚啦</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
