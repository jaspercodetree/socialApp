import Online from '../online/Online';
import { Users } from '../../dummyData';
import './rightbar.css';

export default function Rightbar({ profile }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	console.log(PF);
	const HomeRightbar = () => {
		return (
			<>
				<div className="birthdayContainer">
					<img src="assets/gift.png" alt="" className="birthdayImg" />
					<span className="birthdayText">
						<b>曾國峰</b> 以及 <b>5個其他的朋友</b> 今天生日
					</span>
				</div>
				<img src={`${PF}ad.png`} alt="" className="rightbarAd" />
				<div className="rightbarTitle">在線的朋友</div>
				<ul className="rightbarFriendList">
					{Users.map((u) => (
						<Online key={u.id} user={u} />
					))}
				</ul>
			</>
		);
	};

	const ProfileRightbar = () => {
		return (
			<>
				<h4 className="rightbarTitle">使用者資訊</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">城市:</span>
						<span className="rightbarInfoValue">台北</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">家鄉:</span>
						<span className="rightbarInfoValue">新北</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">關係:</span>
						<span className="rightbarInfoValue">已婚</span>
					</div>
				</div>

				<h4 className="rightbarTitle">使用者朋友</h4>
				<div className="rightbarFollowings">
					<div className="rightbarFollowing">
						<img
							src={`${PF}person/1.jpeg`}
							alt=""
							className="rightbarFollowingImg"
						/>
						<span className="rightbarFollowingName">Jason</span>
					</div>
					<div className="rightbarFollowing">
						<img
							src={`${PF}person/2.jpeg`}
							alt=""
							className="rightbarFollowingImg"
						/>
						<span className="rightbarFollowingName">Jason</span>
					</div>
					<div className="rightbarFollowing">
						<img
							src={`${PF}person/3.jpeg`}
							alt=""
							className="rightbarFollowingImg"
						/>
						<span className="rightbarFollowingName">Jason</span>
					</div>
					<div className="rightbarFollowing">
						<img
							src={`${PF}person/4.jpeg`}
							alt=""
							className="rightbarFollowingImg"
						/>
						<span className="rightbarFollowingName">Jason</span>
					</div>
					<div className="rightbarFollowing">
						<img
							src={`${PF}person/5.jpeg`}
							alt=""
							className="rightbarFollowingImg"
						/>
						<span className="rightbarFollowingName">Jason</span>
					</div>
				</div>
			</>
		);
	};
	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				{profile ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
