import './advertisement.css';

export default function Advertisement() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;

	return (
		<>
			<img src={PF + `ad.jpg`} alt="" className="rightbarAd" />
		</>
	);
}
