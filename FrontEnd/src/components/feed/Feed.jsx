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
	const { user } = useContext(AuthContext);

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
		};
		getPosts();
	}, [username, user._id]);

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
							<Share setPosts={setPosts} />
						)}
						{posts.map((p) => (
							<Post
								key={p._id}
								originPost={p}
								setPosts={setPosts}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
