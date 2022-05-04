import './sidebar.css';
import CloseFriend from '../closeFriend/CloseFriend';
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
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export default function Sidebar() {
	const [friends, setFriends] = useState([]);
	const { user } = useContext(AuthContext);
	// console.log(friends);

	useEffect(() => {
		if (user != null) {
			const getFriends = async () => {
				await axios
					.get('/users/friends/' + user._id)
					.then((res) => setFriends(res.data))
					.catch((err) => console.log(err));
			};
			getFriends();
		}
	}, [user]);

	return (
		<div className="sidebar">
			<div className="sidebarWrapper">
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
				<button className="sidebarButton">Show more</button>
				<hr className="sidebarHr" />
				<ul className="sidebarFriendList">
					{friends.map((f) => (
						<CloseFriend key={f._id} friend={f} />
					))}
				</ul>
			</div>
		</div>
	);
}
