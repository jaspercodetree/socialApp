import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './recommendUser.css';

export default function RecommendUser({ user }) {
	const { PF } = useContext(AuthContext);
	return (
		<li className="recommendUser">
			<img
				src={
					user.profilePicture
						? PF + 'person/' + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=""
				className="recommendUserImg"
			/>
			<span className="recommendUserName">{user.username}</span>
		</li>
	);
}
