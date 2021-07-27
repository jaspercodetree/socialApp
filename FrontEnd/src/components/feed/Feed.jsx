import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
// import { Posts } from "../../dummyData";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const getPosts = async () => {
			const res = await axios.get(
				'posts/timeline/60e553e65cd1772ce8f1e3ea'
			);
			// console.log(res);
			setPosts(res.data);
		};
		getPosts();
	}, []);

	return (
		<div className="feed">
			<div className="feedWrapper">
				<Share />
				{posts.map((p) => (
					<Post key={p.id} post={p} />
				))}
			</div>
		</div>
	);
}
