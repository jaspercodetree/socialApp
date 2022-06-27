import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './advertisement.css';

export default function Advertisement() {
	const { PF } = useContext(AuthContext);

	return (
		<>
			<img src={PF + `ad.jpg`} alt="" className="rightBarAd" />
		</>
	);
}
