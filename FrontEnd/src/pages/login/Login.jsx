import './login.css';

export default function Login() {
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">JasperLogo</h3>
                    <span className="loginDesc">連結世界上所有的朋友</span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <input type="text" placeholder="Email" className="loginInput" />
                        <input type="text" placeholder="Password" className="loginInput" />
                        <button className="loginButton">登入</button>
                        <span className="loginForget">忘記密碼?</span>
                        <button className="loginRegisterButton">註冊</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
