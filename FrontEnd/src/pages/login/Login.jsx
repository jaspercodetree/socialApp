import './login.css';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { loginCall } from '../../apiCalls';
import { useRef } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
	const email = useRef();
	const password = useRef();
	const { isFetching, dispatch } = useContext(AuthContext);

	const handleSubmit = (e) => {
		//讓submit時 不要refresh page
		e.preventDefault();
		loginCall(
			{
				email: email.current.value,
				password: password.current.value,
			},
			dispatch
		);
	};

	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">JasperLogo</h3>
					<span className="loginDesc">連結世界上所有的朋友</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleSubmit}>
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
						<button type="submit" className="loginButton">
							{isFetching ? (
								<CircularProgress
									color="secondary"
									size="18px"
								/>
							) : (
								'登入'
							)}
						</button>
						<span className="loginForget">
							<Link to="/login">忘記密碼?</Link>
						</span>
						<Link to="/register" style={{ textAlign: 'center' }}>
							<button className="loginRegisterButton">
								{isFetching ? (
									<CircularProgress
										color="secondary"
										size="18px"
									/>
								) : (
									'註冊'
								)}
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
