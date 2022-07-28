/* topBar */
import './topBar.css';
import { KeyboardArrowDown, KeyboardArrowUp, Search } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SearchUser from '../searchUser/SearchUser';
import axios from 'axios';
import axiosJWT from '../../AxiosJWTConfig';
import RecommendUser from '../recommendUser/RecommendUser';
import { CircularProgress } from '@material-ui/core';

export default function TopBar() {
	const { user, PF } = useContext(AuthContext);
	const [searchName, setSearchName] = useState([]);
	const [searchUsers, setSearchUsers] = useState([]);
	const [isModalActive, setModalActive] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const logout = async () => {
		setIsFetching(true);
		//clear refreshTokens in database
		await axiosJWT
			.put(`/users/${user._id}`, {
				userId: user._id,
				refreshTokens: [],
			})
			.then(() => {
				//clear localStorage
				localStorage.removeItem('user');
				window.location.replace('/login');
			})
			.catch((err) => console.log(err));
	};
	//searchUsers
	useEffect(() => {
		if (searchName.length !== 0) {
			const getUsers = async () => {
				await axios
					.get(`/users/search?username=${searchName}`)
					.then((res) => setSearchUsers(res.data))
					.catch((err) => console.log(err));
			};
			getUsers();
		}
	}, [searchName]);

	//toggleModal
	const toggleModal = () => {
		setModalActive(true);
	};

	//Modal close outside
	// Create a ref that we add to the element for which we want to detect outside clicks
	const ref = useRef();
	// State for our modal
	const [isModalOpen, setModalOpen] = useState(false);
	// Call hook passing in the ref and a function to call on outside click
	useOnClickOutside(ref, () => {
		setModalOpen(false);
		setFollowingsOpen(false);
		setRecommendUserOpen(false);
	});

	function useOnClickOutside(ref, handler) {
		useEffect(
			() => {
				const listener = (event) => {
					// Do nothing if clicking ref's element or descendent elements
					if (!ref.current || ref.current.contains(event.target)) {
						return;
					}
					handler(event);
				};
				document.addEventListener('mousedown', listener);
				document.addEventListener('touchstart', listener);
				return () => {
					document.removeEventListener('mousedown', listener);
					document.removeEventListener('touchstart', listener);
				};
			},
			// Add ref and handler to effect dependencies
			// It's worth noting that because passed in handler is a new ...
			// ... function on every render that will cause this effect ...
			// ... callback/cleanup to run every render. It's not a big deal ...
			// ... but to optimize you can wrap handler in useCallback before ...
			// ... passing it into this hook.
			[ref, handler]
		);
	}

	//朋友
	const [profileFriends, setProfileFriends] = useState([]);
	const [followingsOpen, setFollowingsOpen] = useState(false);

	const toggleFollowings = () => {
		setFollowingsOpen(!followingsOpen);
	};

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

	//推薦追蹤
	const [recommendUsers, setRecommendUsers] = useState([]);
	const [recommendUserOpen, setRecommendUserOpen] = useState(false);
	const toggleRecommendUser = () => {
		setRecommendUserOpen(!recommendUserOpen);
	};

	useEffect(() => {
		if (user != null) {
			const getUsers = async () => {
				await axios
					.get(`/users/${user._id}/recommendUsers`)
					.then((res) => setRecommendUsers(res.data))
					.catch((err) => console.log(err));
			};
			getUsers();
		}
	}, [user]);

	return (
		<div className="topBarContainer container-fluid">
			<div className="row">
				<div className="topBarLeft col-4 col-lg-4">
					<Link to="/" style={{ textDecoration: 'none' }}>
						<span className="logo">JasperBook</span>
					</Link>
				</div>
				<div className="topBarCenter col-5 col-lg-4">
					<div className="searchBar">
						<Search className="searchIcon" />
						<input
							type="text"
							className="searchInput bg-transparent"
							onChange={(e) => {
								setSearchName(e.target.value);
								toggleModal();
							}}
							placeholder={`搜尋用戶`}
							value={searchName ? searchName : ''}
						/>
					</div>
					<div
						className={`searchUserListModal ${
							isModalActive ? 'd-block' : 'd-none'
						}`}
						onClick={() => {
							setModalActive(false);
							setSearchName([]);
						}}
					>
						<div
							className={`searchUserListWrap position-absolute bg-white py-3 mt-1 border border-gray rounded-3 ${
								searchName.length === 0 ? 'd-none' : ''
							}`}
							onClick={(e) => e.stopPropagation()}
						>
							<ul className="searchUserList m-0 p-0">
								{searchUsers.map((u) => (
									<Link
										to={`/profile/${u.username}`}
										style={{ textDecoration: 'none' }}
										className="text-black"
										key={u._id}
										onClick={() => {
											setModalActive(false);
											setSearchName([]);
										}}
									>
										<SearchUser user={u} />
									</Link>
								))}
							</ul>
						</div>
					</div>
				</div>
				<div className="topBarRight col-3 col-lg-4">
					<img
						src={
							user.profilePicture
								? PF + `/person/${user.profilePicture}`
								: PF + '/person/noAvatar.png'
						}
						alt="userAvatar"
						className="topBarImg me-3"
						onClick={() => setModalOpen(true)}
					/>
					<div className="topBarIcons">
						{/* <div className="topBarIconItem">
							<Person />
							<span className="topBarIconBadge">1</span>
						</div>
						<div className="topBarIconItem">
							<Chat />
							<span className="topBarIconBadge">2</span>
						</div>
						<div className="topBarIconItem">
							<Notifications />
							<span className="topBarIconBadge">3</span>
						</div> */}

						<div
							ref={ref}
							className={`personalModal position-absolute d-flex flex-column align-items-center p-2 ${
								isModalOpen ? '' : 'd-none'
							}`}
						>
							<Link
								id="personalTimeList"
								className="personalModalBtn w-100 text-center mb-1 d-flex align-items-center justify-content-center"
								to={`/profile/${user.username}`}
								onClick={(e) => {
									setModalOpen(false);
								}}
							>
								<span className="topBarUsername text-black">
									{user.username}
								</span>
							</Link>
							<hr className="text-black w-100 my-1" />
							<Link
								name="personalInfoBtn"
								id="personalInfoBtn"
								className="personalModalBtn btn text-black mt-1"
								to={`/profile/${user.username}/personalInfo`}
								onClick={(e) => {
									setModalOpen(false);
								}}
							>
								編輯個人資料
							</Link>

							{/* 朋友列表 */}
							<button
								id="followingsBtn"
								className="personalModalBtn btn text-black mb-1"
								onClick={toggleFollowings}
							>
								<span>朋友列表</span>
								<span>
									{followingsOpen ? (
										<KeyboardArrowUp />
									) : (
										<KeyboardArrowDown />
									)}
								</span>
							</button>
							<div
								className={`rightBarFollowings pt-3 mb-2 w-100 ${
									followingsOpen ? '' : 'd-none'
								}`}
							>
								{profileFriends.map((friend) => (
									<Link
										to={`/profile/${friend.username}`}
										style={{}}
										key={friend._id || 'noFriends'}
										className={`rightBarFollowingsLink px-3 ${
											friend.username === '好友募集中' &&
											'noFriends'
										}`}
										onClick={(e) => {
											setModalOpen(false);
										}}
									>
										<div className="rightBarFollowing">
											<img
												src={
													friend.profilePicture
														? PF +
														  `person/${friend.profilePicture}`
														: PF +
														  '/person/noAvatar.png'
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

							{/* 推薦追蹤 */}
							<button
								id="recommendUserBtn"
								className="personalModalBtn btn text-black mb-1"
								onClick={toggleRecommendUser}
							>
								<span>推薦追蹤</span>
								<span>
									{recommendUserOpen ? (
										<KeyboardArrowUp />
									) : (
										<KeyboardArrowDown />
									)}
								</span>
							</button>
							<ul
								className={`recommendUserList p-3 mb-2 w-100 ${
									recommendUserOpen ? '' : 'd-none'
								}`}
							>
								{recommendUsers.map((u) => (
									<Link
										to={`/profile/${u.username}`}
										style={{ textDecoration: 'none' }}
										className="text-black w-100"
										key={u._id}
										onClick={(e) => {
											setModalOpen(false);
										}}
									>
										<RecommendUser user={u} />
									</Link>
								))}
							</ul>

							<button
								name="logoutBtn"
								id="logoutBtn"
								className="btn"
								onClick={logout}
							>
								{isFetching ? (
									<CircularProgress
										color="inherit"
										size="18px"
									/>
								) : (
									'登出'
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
