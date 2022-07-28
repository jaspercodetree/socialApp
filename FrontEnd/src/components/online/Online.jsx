/* 主頁右欄線上朋友 */
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
			<li className="rightBarFriend">
				<div className="rightBarProfileImgContainer">
					<img
						src={PF + 'person/' + friend.profilePicture}
						alt=""
						className="rightBarProfileImg"
					/>
					<span className="rightBarOnline"></span>
				</div>
				<span className="rightBarUsername">{friend.username}</span>
			</li>
		</Link>
	);
}
