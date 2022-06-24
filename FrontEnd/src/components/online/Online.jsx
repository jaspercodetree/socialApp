import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './online.css';

export default function Online({ friend }) {
	const { PF } = useContext(AuthContext);

	return (
		<Link
			to={`/profile/${friend.username}`}
			style={{ textDecoration: 'none' }}
			key={friend._id}
			className="text-black"
		>
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
		</Link>
	);
}
