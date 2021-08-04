import { useEffect, useState, useContext } from 'react';
import { MoreVert } from '@material-ui/icons';
import axios from 'axios';
//引入時間套件
import { format } from 'timeago.js';
import { AuthContext } from '../../context/AuthContext';

// import { Users } from '../../dummyData';
import './post.css';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user: currentUser } = useContext(AuthContext);

	// let user = Users.filter(u => u.id === 1);
	// filter得到'陣列
	// console.log(user[0])
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLiked] = useState(false);
	//此處與以下的getuser 是指post貼文的user
	const [user, setUser] = useState({});

	useEffect(() => {
		setIsLiked(post.likes.includes(currentUser._id));
	}, [currentUser._id, post.likes]);

	useEffect(() => {
		const getUser = async () => {
			const res = await axios.get(`/users?userId=${post.userId}`);
			setUser(res.data);
		};
		getUser();
	}, [post.userId]);

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
						<MoreVert />
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
						<div className="postCommentText">comments</div>
					</div>
				</div>
			</div>
		</div>
	);
}
