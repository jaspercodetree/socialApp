import './topbar.css';
import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Topbar() {
	const { user, PF } = useContext(AuthContext);
	// console.log(user);

	const logout = () => {
		localStorage.removeItem('user');
		window.location.replace('/login');
	};

	return (
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link to="/" style={{ textDecoration: 'none' }}>
					<span className="logo">JasperBook</span>
				</Link>
			</div>
			<div className="topbarCenter">
				<div className="searchbar">
					<Search className="searchIcon" />
					<input
						type="text"
						className="searchInput"
						placeholder={`搜尋 ${user.username} 的朋友，發布文章、影片`}
					/>
				</div>
			</div>
			<div className="topbarRight">
				<div className="topbarLinks">
					<Link to="/register">
						<span className="topbarLink">HomePage</span>
					</Link>
					<Link to="/login">
						<span className="topbarLink">Timeline</span>
					</Link>
				</div>
				<div className="topbarIcons">
					<div className="topbarIconItem">
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
					</div>
					<div className="topbarIconItem" onClick={logout}>
						登出
					</div>
				</div>
				<Link to={`/profile/${user.username}`}>
					<img
						src={
							user.profilePicture
								? PF + `/person/${user.profilePicture}`
								: PF + '/person/noAvatar.png'
						}
						alt="userAvatar"
						className="topbarImg"
					/>
				</Link>
			</div>
		</div>
	);
}
