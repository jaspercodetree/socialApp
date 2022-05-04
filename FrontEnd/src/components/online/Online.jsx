import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './online.css';

export default function Online({ friend }) {
	const { PF } = useContext(AuthContext);
	return (
		<li className="rightbarFriend">
			<div className="rightbarProfileImgContainer">
				<img
					src={PF + 'person/' + friend.profilePicture}
					alt=""
					className="rightbarProfileImg"
				/>
				<span className="rightbarOnline"></span>
			</div>
			<span className="rightbarUsername">{friend.username}</span>
		</li>
	);
}
