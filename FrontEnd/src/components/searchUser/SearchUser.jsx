import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './searchUser.css';

export default function SearchUser({ user }) {
	const { PF } = useContext(AuthContext);
	return (
		<li className="searchUser m-0 px-3 py-2">
			<img
				src={
					user.profilePicture
						? PF + 'person/' + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=""
				className="searchUserImg"
			/>
			<span className="searchUserName">{user.username}</span>
		</li>
	);
}
