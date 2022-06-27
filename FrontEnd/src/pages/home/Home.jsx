import Feed from '../../components/feed/Feed';
import RightBar from '../../components/rightBar/RightBar';
import Sidebar from '../../components/sidebar/Sidebar';
import TopBar from '../../components/topBar/TopBar';
import './home.css';

export default function Home() {
	return (
		<>
			<TopBar />
			<div className="homeContainer container-fluid">
				<Sidebar />
				<Feed isHomePage={true} />
				<RightBar isHomePage={true} />
			</div>
		</>
	);
}
