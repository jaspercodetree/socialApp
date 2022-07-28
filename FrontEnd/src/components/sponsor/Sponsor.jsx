/* 贊助元件 */
import React from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Sponsor() {
	const { PF } = useContext(AuthContext);

	return (
		<>
			<div className="adWrapper mt-3  d-none d-md-block ">
				<h6 className="fw-bold">贊助</h6>
				<Link
					to={{ pathname: 'https://afriend.club/about.php' }}
					target="_blank"
				>
					<img
						src={PF + `sponsorAndAd/ad_0.png`}
						alt=""
						className="adImg w-100 rounded-3"
					/>
				</Link>
			</div>
		</>
	);
}
