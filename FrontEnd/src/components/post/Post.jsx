import { useEffect, useState } from 'react';
import { MoreVert } from '@material-ui/icons';
import axios from 'axios';
// import { Users } from '../../dummyData';
import './post.css';

export default function Post({ post }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	// console.log(post);

	// let user = Users.filter(u => u.id === 1);
	// filter得到'陣列
	// console.log(user[0])

	const [like, setLike] = useState();
	const [isLiked, setIsLiked] = useState(false);
	const [user, setUser] = useState([]);

	useEffect(() => {
		const getUser = async () => {
			const res = await axios.get(`users/${post.userId}`);
			setUser(res.data);
		};
		getUser();
	}, []);

	const likeHandler = () => {
		isLiked ? setLike(like - 1) : setLike(like + 1);
		setIsLiked(!isLiked);
	};

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
						<img
							src={user.profilePicture}
							alt=""
							className="postProfileImg"
						/>
						<span className="postUsername">{user.username}</span>
						<span className="postDate">{post.date}</span>
					</div>
					<div className="postTopRight">
						<MoreVert />
					</div>
				</div>
				<div className="postCenter">
					<span className="postText">{post?.desc}</span>
					<img src={PF + post.photo} alt="" className="postImg" />
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
						<div className="postCommentText">
							{post.comment}comments
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
