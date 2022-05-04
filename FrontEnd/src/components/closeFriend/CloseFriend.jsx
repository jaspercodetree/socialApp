import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './closeFriend.css';

export default function CloseFriend({ friend }) {
	const { PF } = useContext(AuthContext);
	return (
		<li className="sidebarFriend">
			<img
				src={PF + 'person/' + friend.profilePicture}
				alt=""
				className="sidebarFriendImg"
			/>
			<span className="sidebarFriendName">{friend.username}</span>
		</li>
	);
}
