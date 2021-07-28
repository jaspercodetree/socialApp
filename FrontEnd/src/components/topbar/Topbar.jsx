import './topbar.css';
import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import { Link } from 'react-router-dom';

export default function Topbar() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link to="/" style={{ textDecoration: 'none' }}>
					<span className="logo">JasperBook</span>
				</Link>
			</div>
			<div className="tipbarCenter">
				<div className="searchbar">
					<Search className="searchIcon" />
					<input
						type="text"
						className="searchInput"
						placeholder="搜尋您的朋友，發布文章、影片"
					/>
				</div>
			</div>
			<div className="topbarRight">
				<div className="topbarLinks">
					<span className="topbarLink">HomePage</span>
					<span className="topbarLink">Timeline</span>
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
				</div>
				{/* <Link to={`profile/${user.username}`}> */}
				<img src={`${PF}person/8.jpeg`} alt="" className="topbarImg" />
				{/* </Link> */}
			</div>
		</div>
	);
}
