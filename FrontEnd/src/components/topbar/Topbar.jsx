import './topbar.css';
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

export default function Topbar() {
	const { user, PF } = useContext(AuthContext);
	const [searchName, setSearchName] = useState([]);
	const [searchUsers, setSearchUsers] = useState([]);

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

	return (
		<div className="topbarContainer container-fluid">
			<div className="row">
				<div className="topbarLeft col-4 col-lg-4">
					<Link to="/" style={{ textDecoration: 'none' }}>
						<span className="logo">JasperBook</span>
					</Link>
				</div>
				<div className="topbarCenter col-5 col-lg-4">
					<div className="searchbar">
						<Search className="searchIcon" />
						<input
							type="text"
							className="searchInput bg-transparent"
							onChange={(e) => setSearchName(e.target.value)}
							placeholder={`搜尋用戶`}
						/>
					</div>
					<div
						className={`searchUserListWrap position-absolute bg-white py-3 mt-1 border border-gray rounded-3 ${
							searchName.length === 0 ? 'd-none' : ''
						}`}
					>
						<ul className="searchUserList m-0 p-0">
							{searchUsers.map((u) => (
								<Link
									to={`/profile/${u.username}`}
									style={{ textDecoration: 'none' }}
									className="text-black"
									key={u._id}
								>
									<SearchUser user={u} />
								</Link>
							))}
						</ul>
					</div>
				</div>
				<div className="topbarRight col-3 col-lg-4">
					<Link to={`/profile/${user.username}`}>
						<img
							src={
								user.profilePicture
									? PF + `/person/${user.profilePicture}`
									: PF + '/person/noAvatar.png'
							}
							alt="userAvatar"
							className="topbarImg me-3"
						/>
					</Link>
					<div className="topbarIcons">
						{/* <div className="topbarIconItem">
							<Person />
							<span className="topbarIconBadge">1</span>
						</div>
						<div className="topbarIconItem">
							<Chat />
							<span className="topbarIconBadge">2</span>
						</div>
						<div className="topbarIconItem">
							<Notifications />
							<span className="topbarIconBadge">3</span>
						</div> */}
						<div className="topbarIconItem" onClick={logout}>
							<ExitToAppSharp />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
