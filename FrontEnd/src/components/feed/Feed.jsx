import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
// import { Posts } from "../../dummyData";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Feed({ username }) {
	const [posts, setPosts] = useState([]);
	const { user } = useContext(AuthContext);

	//有收到username 則判斷為使用者個人頁面；否則為使用者共同貼圖牆頁面
	useEffect(() => {
		const getPosts = async () => {
			const res = username
				? await axios.get('/posts/profile/' + username)
				: await axios.get('/posts/timeline/' + user.data._id);
			setPosts(res.data);
		};
		getPosts();
	}, [username, user.data._id]);

	return (
		<div className="feed">
			<div className="feedWrapper">
				<Share />
				{posts.map((p) => (
					<Post key={p._id} post={p} />
				))}
			</div>
		</div>
	);
}
