import './rightbar.css';
import Advertisement from '../advertisement/Advertisement';
import { Add, Remove } from '@material-ui/icons';
import Online from '../online/Online';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export default function Rightbar({ user, isHomePage }) {
	const [friends, setFriends] = useState([]);
	const [profileFriends, setProfileFriends] = useState([]);
	const { user: loginUser, dispatch, PF } = useContext(AuthContext);

	const [followed, setFollowed] = useState(false);

	// console.log(user);
	/* user為此profile頁面的user ;  loginUser為目前登入的user */

	//profile 線上朋友列表
	useEffect(() => {
		if (loginUser && Object.entries(loginUser).length !== 0) {
			// console.log(Object.entries(loginUser));
			const getFriends = async () => {
				await axios
					.get('/users/friends/' + loginUser._id)
					.then((res) => setFriends(res.data))
					.catch((err) => console.log(err));
			};
			getFriends();
		}
	}, [loginUser]);

	//profile 右側欄朋友列表
	useEffect(() => {
		if (user && Object.entries(user).length !== 0) {
			// console.log(Object.entries(user));
			const getProfileFriends = async () => {
				await axios
					.get(`/users/friends/` + user._id)
					.then((res) => {
						res.data.length !== 0
							? setProfileFriends(res.data)
							: setProfileFriends([
									{
										profilePicture: 'noAvatar.png',
										username: 'QwQ 朋友募集中',
									},
							  ]);
					})
					.catch((err) => console.log(err));
			};
			getProfileFriends();
		}
	}, [user]);

	//加入/解除追蹤
	useEffect(() => {
		setFollowed(loginUser.followings.includes(user?._id));
	}, [loginUser, user?._id]);

	//注意:即使已經更新資料庫，但由於追蹤按鈕的文字是由context內的followings是否有user._id判斷，因此我們必須透過useReducer去更新context的狀態，來更新文字
	const handleClick = async () => {
		if (followed) {
			await axios.put(`/users/${user._id}/unfollow`, {
				userId: loginUser._id,
			});
			dispatch({ type: 'UNFOLLOW', payload: user._id });
		} else {
			await axios.put(`/users/${user._id}/follow`, {
				userId: loginUser._id,
			});
			dispatch({ type: 'FOLLOW', payload: user._id });
		}

		// setFollowed(!followed);
	};

	const HomeRightbar = () => {
		return (
			<>
				<div className="birthdayContainer">
					<img src="assets/gift.png" alt="" className="birthdayImg" />
					<span className="birthdayText">
						<b>曾國峰</b> 以及 <b>5個其他的朋友</b> 今天生日
					</span>
				</div>
				<Advertisement />
				<div className="rightbarTitle">在線的朋友</div>
				<ul className="rightbarFriendList">
					{friends.map((f) => (
						<Online key={f._id} friend={f} />
					))}
				</ul>
			</>
		);
	};

	const ProfileRightbar = () => {
		return (
			<>
				{loginUser.username !== user.username && (
					<div className="rightbarFollowButton" onClick={handleClick}>
						{followed ? '解除追蹤 ' : '加入追蹤 '}
						{followed ? <Remove /> : <Add />}
					</div>
				)}

				<h4 className="rightbarTitle">使用者資訊</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">城市:</span>
						<span className="rightbarInfoValue">
							{user.city ? user.city : '神秘都市'}
						</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">家鄉:</span>
						<span className="rightbarInfoValue">
							{user.from ? user.from : '秘密之地'}
						</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">關係:</span>
						<span className="rightbarInfoValue">
							{user.relationship === 0
								? '單身'
								: user.relationship === 1
								? '已婚'
								: '秘密'}
						</span>
					</div>
				</div>

				<h4 className="rightbarTitle">使用者朋友</h4>
				<div className="rightbarFollowings">
					{profileFriends.map((friend) => (
						<Link
							to={`/profile/${friend.username}`}
							style={{ textDecoration: 'none' }}
							key={friend._id}
						>
							<div className="rightbarFollowing">
								<img
									src={
										friend.profilePicture
											? PF +
											  `person/${friend.profilePicture}`
											: PF + '/person/noAvatar.png'
									}
									alt=""
									className="rightbarFollowingImg"
								/>
								<span className="rightbarFollowingName">
									{friend.username}
								</span>
							</div>
						</Link>
					))}
				</div>
				<Advertisement />
			</>
		);
	};
	return (
		<div
			className={
				isHomePage === true
					? 'rightbar d-none d-md-block col-md-3 col-lg-2'
					: 'rightbar d-none d-md-block col-md-3'
			}
		>
			<div className="rightbarWrapper">
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
