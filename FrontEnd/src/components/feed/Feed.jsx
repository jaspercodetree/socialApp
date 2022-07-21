import './feed.css';
import Post from '../post/Post';
import Share from '../share/Share';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import PersonalInfo from '../personalInfo/PersonalInfo';

export default function Feed({
	username,
	isHomePage,
	isPersonalInfo,
	getUser,
}) {
	const [posts, setPosts] = useState([]);
	const [isGetData, setIsGetData] = useState(false);
	//random gif
	const [randomNo, setRandomNo] = useState();

	const { user, PF } = useContext(AuthContext);
	const [allUserInfoForComment, setAllUserInfoForComment] = useState({});

	//有收到username 則判斷為使用者個人頁面；否則為使用者共同貼圖牆頁面
	useEffect(() => {
		const getPosts = async () => {
			const res = username
				? await axios.get('/posts/profile/' + username)
				: await axios.get('/posts/timeline/' + user._id);

			//依貼文時間排序
			setPosts(
				res.data.sort((p1, p2) => {
					if (new Date(p1.createdAt) > new Date(p2.createdAt))
						return -1;
					if (new Date(p1.createdAt) < new Date(p2.createdAt))
						return 1;
					return 0;
				})
			);
			setIsGetData(true);
			setRandomNo(Math.floor(Math.random() * 1) + 1);
			// console.log(randomNo);
		};
		getPosts();
	}, [username, user._id]);

	//get all userInfo for commentItem username & profilePicture
	useEffect(() => {
		let userObj = {};
		const getAllUser = async () => {
			await axios
				.get(`/users/all`)
				.then((res) => {
					res.data.forEach((i) => {
						userObj[`${i._id}`] = {
							username: i.username,
							profilePicture: i.profilePicture,
						};
					});
					setAllUserInfoForComment(userObj);
				})
				.catch((err) => console.log(err));
		};
		getAllUser();
	}, []);
	// console.log('allUserInfoForComment', allUserInfoForComment);
	return (
		<div
			className={
				isHomePage === true
					? 'feed col-12 col-md-9 col-lg-8'
					: 'feed col-12 col-md-9'
			}
		>
			<div className="feedWrapper">
				{isPersonalInfo ? (
					<PersonalInfo getUser={getUser} />
				) : (
					<>
						{(isHomePage || username === user.username) && (
							<Share setPosts={setPosts} username={username} />
						)}
						{isGetData &&
							(posts.length !== 0 ? (
								posts.map((p) => (
									<Post
										key={p._id}
										originPost={p}
										setPosts={setPosts}
										allUserInfoForComment={
											allUserInfoForComment
										}
										username={username}
									/>
								))
							) : (
								<div className="w-100 p-3 mt-3 border rounded-3 text-center">
									<h6>等待開墾中</h6>
									<img
										className="w-75"
										src={
											PF +
											`/post/noPostsView_${randomNo}.jpeg`
										}
										alt=""
									/>
								</div>
							))}
					</>
				)}
			</div>
		</div>
	);
}
