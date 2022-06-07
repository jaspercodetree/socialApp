import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import './profile.css';

export default function Profile() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	//練習用useParams  (可以透過.username拿取 是因為在App.js已有命名)
	const username = useParams().username;

	const [user, setUser] = useState({});
	useEffect(() => {
		const getUser = async () => {
			await axios
				.get(`/users?username=${username}`)
				.then((res) => {
					// console.log(res.data);
					if (res.data.coverPicture) {
						res.data.coverPictureSrc =
							PF + `post/${res.data.coverPicture}`;
						setUser(res.data);
					} else {
						res.data.coverPictureSrc = PF + `person/noCover.png`;
						setUser(res.data);
					}
				})
				.catch((err) => console.log(err));
		};
		getUser();
	}, [username, PF]);

	// console.log(user);

	return (
		<>
			<Topbar />
			<div className="profile">
				<Sidebar />
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<img
								src={user.coverPictureSrc}
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
							<span className="profileInfoDesc">{user.desc}</span>
						</div>
					</div>
					<div className="profileRightBottom">
						<Feed username={username} />
						<Rightbar user={user} />
					</div>
				</div>
			</div>
		</>
	);
}
