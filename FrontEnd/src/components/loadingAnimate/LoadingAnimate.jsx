import React from 'react';
import './loadingAnimate.css';

export const LoadingAnimate = ({ isLoading }) => {
	return (
		<>
			<div
				className={`loadingWrap position-fixed w-100 h-100 align-items-center justify-content-center ${
					isLoading ? 'd-flex' : 'd-none'
				}`}
			>
				<div className="loader">
					<div className="loader__bar"></div>
					<div className="loader__bar"></div>
					<div className="loader__bar"></div>
					<div className="loader__bar"></div>
					<div className="loader__bar"></div>
					<div className="loader__ball"></div>
				</div>
			</div>
		</>
	);
};
