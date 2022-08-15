import './login.css';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { loginCall } from '../../apiCalls';
import { useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Login({ error }) {
	const email = useRef();
	const password = useRef();
	const { isFetching, dispatch, PF } = useContext(AuthContext);

	const handleSubmit = (e) => {
		e && e.preventDefault();
		loginCall(
			{
				email: email.current.value,
				password: password.current.value,
			},
			dispatch
		);
	};

	return (
		<div className="login container-fluid">
			<div className="loginWrapper row">
				<div className="loginLeft col-12 col-md-6">
					<h3 className="loginLogo">JasperBook</h3>
					<span className="loginDesc">連結世界上所有的朋友</span>
				</div>
				<div className="loginRight col-12 col-md-6 mt-4 mt-md-0">
					<div className="fastLoginWrapper mt-3">
						<h6 className="text-center">-- 範例快速登入 --</h6>
						<h6
							className="sampleLogin text-primary text-center fw-bold mb-3"
							onClick={() => {
								email.current.value = 'takeshi@example.com';
								password.current.value = 'jasper';
								handleSubmit();
							}}
						>
							金城武
						</h6>
					</div>
					<form className="loginBox p-4" onSubmit={handleSubmit}>
						<input
							type="email"
							placeholder="Email"
							className="loginInput"
							required
							ref={email}
						/>
						<input
							type="password"
							placeholder="Password"
							className="loginInput"
							required
							minLength="5"
							ref={password}
						/>
						<button type="submit" className="loginButton mb-0">
							{isFetching ? (
								<CircularProgress color="inherit" size="18px" />
							) : (
								'登入'
							)}
						</button>
						<span className="text-center text-danger  mt-1">
							{error}
						</span>
						{/* <span className="loginForget">
							<Link to="/login">忘記密碼?</Link>
						</span> */}
						<hr className="mt-3" />
						<Link to="/register" style={{ textAlign: 'center' }}>
							<button className="loginRegisterButton">
								註冊
							</button>
						</Link>
					</form>

					<div className=" mt-3">
						<h6 className="text-center">-- 手機瀏覽網頁連結 --</h6>
						<div className="text-center fw-bold">
							<img
								src={PF + `mobileWebQRCOde.png`}
								alt="mobileQRCode"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
