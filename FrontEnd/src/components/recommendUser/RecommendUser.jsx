import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './recommendUser.css';

export default function RecommendUser({ user }) {
	const { PF } = useContext(AuthContext);
	return (
		<li className="sidebarFriend">
			<img
				src={
					user.profilePicture
						? PF + 'person/' + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=""
				className="sidebarFriendImg"
			/>
			<span className="sidebarFriendName">{user.username}</span>
		</li>
	);
}
