import './register.css';

export default function Register() {
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">JasperLogo</h3>
                    <span className="loginDesc">連結世界上所有的朋友</span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                        <input type="text" placeholder="UserName" className="loginInput" />
                        <input type="text" placeholder="Email" className="loginInput" />
                        <input type="text" placeholder="Password" className="loginInput" />
                        <input type="text" placeholder="Password Again" className="loginInput" />
                        <button className="loginButton">註冊</button>
                        <button className="loginRegisterButton">登入帳戶</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
