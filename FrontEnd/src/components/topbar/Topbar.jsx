import './topBar.css';
import { Search } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SearchUser from '../searchUser/SearchUser';
import axios from 'axios';
import axiosJWT from '../../AxiosJWTConfig';

export default function TopBar() {
	const { user, PF } = useContext(AuthContext);
	const [searchName, setSearchName] = useState([]);
	const [searchUsers, setSearchUsers] = useState([]);
	const [isModalActive, setModalActive] = useState(false);

	const logout = async () => {
		//clear refreshTokens in database
		await axiosJWT.put(`/users/${user._id}`, {
			userId: user._id,
			refreshTokens: [],
		});
		//clear localStorage
		localStorage.removeItem('user');
		window.location.replace('/login');
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
	useOnClickOutside(ref, () => setModalOpen(false));

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
							onClick={(e) => {
								setModalOpen(false);
							}}
						>
							<Link
								id="personalTimeList"
								className="w-100 text-center mb-1 d-flex align-items-center justify-content-center"
								to={`/profile/${user.username}`}
							>
								<span className="topBarUsername text-black">
									{user.username}
								</span>
							</Link>
							<hr className="text-black w-100 my-1" />
							<Link
								name="personalInfoBtn"
								id="personalInfoBtn"
								className="btn text-black my-1"
								to={`/profile/${user.username}/personalInfo`}
							>
								編輯個人資料
							</Link>
							<button
								name="logoutBtn"
								id="logoutBtn"
								className="btn"
								onClick={logout}
							>
								登出
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
