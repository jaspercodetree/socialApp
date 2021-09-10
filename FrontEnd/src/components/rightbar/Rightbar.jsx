import './rightbar.css';
import Advertisement from '../advertisement/Advertisement';
import { Add, Remove } from '@material-ui/icons';
import { Users } from '../../dummyData';
import Online from '../online/Online';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	const [friends, setFriends] = useState([]);
	const { user: currentUser, dispatch } = useContext(AuthContext);

	const [followed, setFollowed] = useState(false);

	/* user為此profile頁面的user ;  currentUser為目前登入的user */

	//profile 右側欄朋友列表
	useEffect(() => {
		if (user != null) {
			const getFriends = async () => {
				try {
					const friendsList = await axios.get(
						'/users/friends/' + user._id
					);
					setFriends(friendsList.data);
				} catch (err) {
					console.log(err);
				}
			};
			getFriends();
		}
	}, [user]);

	//加入/解除追蹤
	useEffect(() => {
		setFollowed(currentUser.followings.includes(user?._id));
	}, [currentUser, user?._id]);

	//注意:即使已經更新資料庫，但由於追蹤按鈕的文字是由context內的followings是否有user._id判斷，因此我們必須透過useReducer去更新context的狀態，來更新文字
	const handleClick = async () => {
		if (followed) {
			await axios.put(`/users/${user._id}/unfollow`, {
				userId: currentUser._id,
			});
			dispatch({ type: 'UNFOLLOW', payload: user._id });
		} else {
			await axios.put(`/users/${user._id}/follow`, {
				userId: currentUser._id,
			});
			dispatch({ type: 'FOLLOW', payload: user._id });
		}

		setFollowed(!followed);
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
				{currentUser.username !== user.username && (
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
					{friends.map((friend) => (
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
		<div className="rightbar">
			<div className="rightbarWrapper">
				{user ? <ProfileRightbar /> : <HomeRightbar />}
			</div>
		</div>
	);
}
