import './register.css';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

export default function Register() {
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const passwordAgain = useRef();

	const history = useHistory();
	const [isValidity, setValidity] = useState(0);

	//密碼相同驗證
	const checkPasswordConsistency = () => {
		if (password.current.value !== passwordAgain.current.value) {
			setValidity(1);
		} else {
			setValidity(0);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const user = {
			username: username.current.value,
			email: email.current.value,
			password: password.current.value,
		};

		isValidity === 0 &&
			(await axios
				.post('/auth/register', user)
				.then((res) => history.push('/login'))
				.catch((err) => {
					setValidity(2);
					console.log(err);
				}));
	};

	return (
		<div className="register container-fluid">
			<div className="registerWrapper row">
				<div className="registerLeft  col-12 col-md-6">
					<h3 className="registerLogo">JasperBook</h3>
					<span className="registerDesc">連結世界上所有的朋友</span>
				</div>
				<form
					className="registerRight col-12 col-md-6 mt-4 mt-md-0"
					onSubmit={handleSubmit}
				>
					<div className="registerBox">
						<input
							type="text"
							placeholder="使用者姓名"
							className="registerInput"
							required
							ref={username}
						/>
						<input
							type="email"
							placeholder="Email"
							className="registerInput"
							required
							ref={email}
						/>
						<input
							type="password"
							placeholder="密碼"
							className="registerInput"
							required
							minLength="5"
							ref={password}
						/>
						<input
							type="password"
							placeholder="確認密碼"
							className="registerInput"
							required
							ref={passwordAgain}
							onBlur={checkPasswordConsistency}
						/>
						<button className="registerButton m-0" type="submit">
							註冊
						</button>
						<span className="validityText text-center text-danger mt-1">
							{isValidity === 1 &&
								'您輸入的密碼不一致，請重新檢查'}
							{isValidity === 2 && '此email已註冊'}
						</span>
						<hr className="mt-3" />
						<Link to="/login" style={{ textAlign: 'center' }}>
							<button className="loginRegisterButton">
								返回登入
							</button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
