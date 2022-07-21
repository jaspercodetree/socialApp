import axios from 'axios';
import { useCallback, useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Feed from '../../components/feed/Feed';
import RightBar from '../../components/rightBar/RightBar';
import Sidebar from '../../components/sidebar/Sidebar';
import TopBar from '../../components/topBar/TopBar';
import { AuthContext } from '../../context/AuthContext';
import './profile.css';

export default function Profile({ isPersonalInfo }) {
	const { PF } = useContext(AuthContext);

	//練習用useParams  (可以透過.username拿取 是因為在App.js已有命名)
	const username = useParams().username;

	const [user, setUser] = useState({});

	const getUser = useCallback(async () => {
		await axios
			.get(`/users?username=${username}`)
			.then((res) => {
				// console.log(res.data);
				if (res.data.coverPicture) {
					res.data.coverPictureSrc =
						PF + `person/${res.data.coverPicture}`;
					setUser(res.data);
				} else {
					res.data.coverPictureSrc = PF + `person/noCover.png`;
					setUser(res.data);
				}
			})
			.catch((err) => console.log(err));
	}, [username, PF]);

	useEffect(() => {
		getUser();
	}, [username, PF, getUser]);

	// console.log(user);

	return (
		<>
			<TopBar />
			<div className="profile">
				<Sidebar />
				<div className="profileRight col-12 col-lg-10">
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
						<Feed
							username={username}
							isPersonalInfo={isPersonalInfo}
							getUser={getUser}
						/>
						<RightBar user={user} />
					</div>
				</div>
			</div>
		</>
	);
}
