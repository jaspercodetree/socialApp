import './topBar.css';
import {
	Search,
	Person,
	Chat,
	Notifications,
	ExitToAppSharp,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SearchUser from '../searchUser/SearchUser';
import axios from 'axios';

export default function TopBar() {
	const { user, PF } = useContext(AuthContext);
	const [searchName, setSearchName] = useState([]);
	const [searchUsers, setSearchUsers] = useState([]);
	const [isModalActive, setModalActive] = useState(false);

	const logout = () => {
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
					<Link to={`/profile/${user.username}`}>
						<img
							src={
								user.profilePicture
									? PF + `/person/${user.profilePicture}`
									: PF + '/person/noAvatar.png'
							}
							alt="userAvatar"
							className="topBarImg me-3"
						/>
					</Link>
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
						<div className="topBarIconItem" onClick={logout}>
							<ExitToAppSharp />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}