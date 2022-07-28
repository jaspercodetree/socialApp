/* 廣告元件 */
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Advertisement() {
	const { PF } = useContext(AuthContext);

	return (
		<>
			<div className="adWrapper mt-4">
				<h6 className="fw-bold">廣告</h6>
				{[1, 2, 3, 4, 5].map((i) => {
					return (
						<img
							key={i}
							src={PF + `sponsorAndAd/ad_${i}.jpg`}
							alt=""
							className="adImg d-none d-md-block w-100 rounded-3 mt-3"
						/>
					);
				})}
			</div>
		</>
	);
}
