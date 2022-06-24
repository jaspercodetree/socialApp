import './sidebar.css';
import RecommendUser from '../recommendUser/RecommendUser';
import {
	RssFeed,
	Chat,
	PlayCircleFilledOutlined,
	Group,
	Bookmark,
	HelpOutline,
	WorkOutline,
	Event,
	School,
} from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

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
				<h6 className="mb-3 ms-1 ">推薦朋友名單</h6>
				<ul className="sidebarFriendList">
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

				{/* <hr className="sidebarHr" />

				<ul className="sidebarList">
					<li className="sidebarListItem">
						<RssFeed className="sidebarIcon" />
						<span className="sidebarListItemText">Feed</span>
					</li>
					<li className="sidebarListItem">
						<Chat className="sidebarIcon" />
						<span className="sidebarListItemText">Chats</span>
					</li>
					<li className="sidebarListItem">
						<PlayCircleFilledOutlined className="sidebarIcon" />
						<span className="sidebarListItemText">Videos</span>
					</li>
					<li className="sidebarListItem">
						<Group className="sidebarIcon" />
						<span className="sidebarListItemText">Groups</span>
					</li>
					<li className="sidebarListItem">
						<Bookmark className="sidebarIcon" />
						<span className="sidebarListItemText">Bookmarks</span>
					</li>
					<li className="sidebarListItem">
						<HelpOutline className="sidebarIcon" />
						<span className="sidebarListItemText">Questions</span>
					</li>
					<li className="sidebarListItem">
						<WorkOutline className="sidebarIcon" />
						<span className="sidebarListItemText">Jobs</span>
					</li>
					<li className="sidebarListItem">
						<Event className="sidebarIcon" />
						<span className="sidebarListItemText">Events</span>
					</li>
					<li className="sidebarListItem">
						<School className="sidebarIcon" />
						<span className="sidebarListItemText">Courses</span>
					</li>
				</ul>
				<button className="sidebarButton">Show more</button> */}
			</div>
		</div>
	);
}
