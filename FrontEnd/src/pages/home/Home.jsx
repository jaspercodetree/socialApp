import { useContext } from 'react';
import Feed from '../../components/feed/Feed';
import { LoadingAnimate } from '../../components/loadingAnimate/LoadingAnimate';
import RightBar from '../../components/rightBar/RightBar';
import Sidebar from '../../components/sidebar/Sidebar';
import TopBar from '../../components/topBar/TopBar';
import { AuthContext } from '../../context/AuthContext';
import './home.css';

export default function Home() {
	const { isLoading } = useContext(AuthContext);

	return (
		<>
			<LoadingAnimate isLoading={isLoading} />
			<TopBar />
			<div className="homeContainer container-fluid">
				<Sidebar />
				<Feed isHomePage={true} />
				<RightBar isHomePage={true} />
			</div>
		</>
	);
}
