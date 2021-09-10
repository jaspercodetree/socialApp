import './register.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

export default function Register() {
	const username = useRef();
	const email = useRef();
	const password = useRef();
	const passwordAgain = useRef();

	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.current.value !== passwordAgain.current.value) {
			// passwordAgain.current.setCustomValidity(
			// 	'您輸入的密碼不一致，請重新檢查'
			// );
			// alert('您輸入的密碼不一致，請重新檢查');
		} else {
			const user = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value,
			};
			try {
				await axios.post('/auth/register', user);
				history.push('/login');
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="register">
			<div className="registerWrapper">
				<div className="registerLeft">
					<h3 className="registerLogo">JasperLogo</h3>
					<span className="registerDesc">連結世界上所有的朋友</span>
				</div>
				<form className="registerRight" onSubmit={handleSubmit}>
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
						/>
						<button className="registerButton" type="submit">
							註冊
						</button>
						<Link to="/login" style={{ textAlign: 'center' }}>
							<button className="loginRegisterButton">
								登入帳戶
							</button>
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
