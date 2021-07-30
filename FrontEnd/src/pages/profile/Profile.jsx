import axios from 'axios';
import { useEffect, useState } from 'react';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import './profile.css';

export default function Profile() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const [user, setUser] = useState({});
	useEffect(() => {
		const getUser = async () => {
			const res = await axios.get('/users?username=jasper');
			setUser(res.data);
		};
		getUser();
	}, []);

	return (
		<>
			<Topbar />
			<div className="profile">
				<Sidebar />
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<img
								src={
									user.coverPicture
										? PF + `person/${user.coverPicture}`
										: PF + `person/noCover.png`
								}
								alt=""
								className="profileCoverImg"
							/>
							<img
								src={
									user.profilePicture
										? PF + `person/${user.profilePicture}`
										: PF + `person/noAvatar.png`
								}
								alt=""
								className="profileUserImg"
							/>
						</div>
						<div className="profileInfo">
							<h4 className="profileInfoName">{user.username}</h4>
							<span className="profileInfoDesc">I'm cool</span>
						</div>
					</div>
					<div className="profileRightBottom">
						<Feed username="jasper" />
						<Rightbar profile />
					</div>
				</div>
			</div>
		</>
	);
}
