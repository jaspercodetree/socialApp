/* 左欄 */
import './sidebar.css';
import RecommendUser from '../recommendUser/RecommendUser';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Advertisement from '../advertisement/Advertisement';

export default function Sidebar() {
	const [recommendUsers, setRecommendUsers] = useState([]);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user != null) {
			const getUsers = async () => {
				await axios
					.get(`/users/${user._id}/recommendUsers`)
					.then((res) => setRecommendUsers(res.data))
					.catch((err) => console.log(err));
			};
			getUsers();
		}
	}, [user]);

	return (
		<div className="sidebar d-none d-lg-block col-lg-2">
			<div className="sidebarWrapper">
				<h6 className="mb-3 ms-1 fw-bold">推薦追蹤</h6>
				<ul className="recommendUserList">
					{recommendUsers.map((u) => (
						<Link
							to={`/profile/${u.username}`}
							style={{ textDecoration: 'none' }}
							className="text-black"
							key={u._id}
						>
							<RecommendUser user={u} />
						</Link>
					))}
				</ul>
				<Advertisement />
			</div>
		</div>
	);
}
