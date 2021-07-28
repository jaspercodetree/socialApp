import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
// import { Posts } from "../../dummyData";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed({ username }) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const getPosts = async () => {
			const res = username
				? await axios.get('/posts/profile/' + username)
				: await axios.get('posts/timeline/60e553e65cd1772ce8f1e3ea');
			// console.log(res);
			setPosts(res.data);
		};
		getPosts();
	}, [username]);

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
