/* 右欄 */
import './rightBar.css';
import {
	Add,
	KeyboardArrowDown,
	KeyboardArrowUp,
	Remove,
} from '@material-ui/icons';
import Online from '../online/Online';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import axiosJWT from '../../AxiosJWTConfig';
import Sponsor from '../sponsor/Sponsor';

export default function RightBar({ user, isHomePage }) {
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
										username: '好友募集中',
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
			await axiosJWT.put(`/users/${user._id}/unfollow`, {
				userId: loginUser._id,
			});
			dispatch({ type: 'UNFOLLOW', payload: user._id });
		} else {
			await axiosJWT.put(`/users/${user._id}/follow`, {
				userId: loginUser._id,
			});
			dispatch({ type: 'FOLLOW', payload: user._id });
		}

		// setFollowed(!followed);
	};

	//mobile
	const [rightBarInfoOpen, setRightBarInfoOpen] = useState(true);
	const [rightBarFollowingsOpen, setRightBarFollowingsOpen] = useState(false);
	const toggleRightBarInfo = () => {
		setRightBarInfoOpen(!rightBarInfoOpen);
	};
	const toggleRightBarFollowings = () => {
		setRightBarFollowingsOpen(!rightBarFollowingsOpen);
	};

	const HomeRightBar = () => {
		return (
			<>
				{/* <div className="birthdayContainer">
					<img src="assets/gift.png" alt="" className="birthdayImg" />
					<span className="birthdayText">
						<b>曾國峰</b> 以及 <b>5個其他的朋友</b> 今天生日
					</span>
				</div> */}
				<Sponsor />
				<div className="rightBarTitle fw-bold mt-0 mt-md-3 mb-1 px-2 px-sm-4 px-md-0 py-2">
					所有朋友
				</div>
				<ul className="rightBarFriendList">
					{friends.map((f) => (
						<Online key={f._id} friend={f} />
					))}
				</ul>
			</>
		);
	};

	const ProfileRightBar = () => {
		return (
			<>
				{loginUser.username !== user.username && (
					<div
						className={`rightBarFollowButton ${
							followed ? 'unFollowBtn' : ''
						}`}
						onClick={handleClick}
					>
						{followed ? '解除追蹤 ' : '加入追蹤 '}
						{followed ? <Remove /> : <Add />}
					</div>
				)}
				<hr className="mt-0 d-block d-md-none" />

				<h4
					className="rightBarTitle fw-bold mt-0 mt-md-3 mb-1 px-2 px-sm-4 px-md-0 py-2"
					onClick={toggleRightBarInfo}
				>
					個人資訊
					<span className="d-md-none">
						{rightBarInfoOpen ? (
							<KeyboardArrowUp />
						) : (
							<KeyboardArrowDown />
						)}
					</span>
				</h4>
				<div
					className={`rightBarInfo px-2 px-sm-4 px-md-0 d-md-block ${
						rightBarInfoOpen ? '' : 'd-none'
					}`}
				>
					<div
						className={`jasperInfo ${
							user.username === 'jasper' ? '' : 'd-none'
						}`}
					>
						<div className="rightBarInfoItem">
							<h6>經歷:</h6>
							<h6 className="ms-5">全端工程師 1.5 年</h6>
						</div>
						<div className="rightBarInfoItem">
							<h6>學歷: </h6>
							<h6 className="ms-5">長庚大學電子工程、成功高中</h6>
						</div>
						<div className="rightBarInfoItem">
							<h6>前端:</h6>
							<h6 className="ms-5">
								React、Bootstrap、SASS、styled-components、Tailwind、TypeScript
							</h6>
							<h6>後端:</h6>
							<h6 className="ms-5">
								ASP.NET Core、C#、Node.js、MSSQL、MongoDB
							</h6>
						</div>
						<div className="rightBarInfoItem">
							<h6>工作: </h6>
							<h6 className="ms-5">翔睿德股份有限公司</h6>
						</div>
						<div className="rightBarInfoItem">
							<h6>專案: </h6>
							<h6 className="ms-5">1. ERP系統</h6>
							<h6 className="ms-5 mb-3">
								建構企業、會計、進銷存系統，後端 asp.net core
								3.1架構，前端 JS & jQuery +
								Bootstrap，連結各個資料表，處理各式表單
							</h6>
							<h6 className="ms-5">2. 產品網站</h6>
							<h6 className="ms-5">
								產品形象網站開發，後端 asp.net core 架構，前端
								React + Bootstrap，多國語言
							</h6>
						</div>
					</div>
					<div className="rightBarInfoItem">
						<span className="rightBarInfoKey">現居:</span>
						<span className="rightBarInfoValue">
							{user.city ? user.city : '神秘都市'}
						</span>
					</div>
					<div className="rightBarInfoItem">
						<span className="rightBarInfoKey">來自:</span>
						<span className="rightBarInfoValue">
							{user.from ? user.from : '秘密星球'}
						</span>
					</div>
					<div className="rightBarInfoItem">
						<span className="rightBarInfoKey">關係:</span>
						<span className="rightBarInfoValue">
							{user.relationship === 0
								? '單身'
								: user.relationship === 1
								? '穩定交往中'
								: 'secret'}
						</span>
					</div>
				</div>
				<h4
					className="rightBarTitle fw-bold mt-0 mt-md-3 mb-1 px-2 px-sm-4 px-md-0 py-2"
					onClick={toggleRightBarFollowings}
				>
					所有朋友
					<span className="d-md-none">
						{rightBarFollowingsOpen ? (
							<KeyboardArrowUp />
						) : (
							<KeyboardArrowDown />
						)}
					</span>
				</h4>
				<div
					className={`rightBarFollowings px-2 px-sm-4 px-md-0 d-md-grid ${
						rightBarFollowingsOpen ? '' : 'd-none'
					}`}
				>
					{profileFriends.map((friend) => (
						<Link
							to={`/profile/${friend.username}`}
							style={{}}
							key={friend._id || 'noFriends'}
							className={`rightBarFollowingsLink ${
								friend.username === '好友募集中' && 'noFriends'
							}`}
						>
							<div className="rightBarFollowing">
								<img
									src={
										friend.profilePicture
											? PF +
											  `person/${friend.profilePicture}`
											: PF + '/person/noAvatar.png'
									}
									alt=""
									className="rightBarFollowingImg"
								/>
								<span className="rightBarFollowingName">
									{friend.username}
								</span>
							</div>
						</Link>
					))}
				</div>
				<Sponsor />
			</>
		);
	};
	return (
		<div
			className={
				isHomePage === true
					? 'rightBar d-none d-md-block col-md-3 col-lg-2'
					: 'rightBar col-md-3'
			}
		>
			<div className="rightBarWrapper p-3 pb-0 pb-md-3">
				{user ? <ProfileRightBar /> : <HomeRightBar />}
			</div>
		</div>
	);
}
