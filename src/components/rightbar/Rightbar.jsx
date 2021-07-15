import './rightbar.css'

export default function Rightbar() {
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                <div className="birthdayContainer">
                    <img src="assets/gift.png" alt="" className="birthdayImg" />
                    <span className="birthdayText">
                        <b>李泰鑫</b> 以及 <b>5個其他的朋友</b> 今天生日
                    </span>
                </div>
                <img src="assets/ad.png" alt="" className="rightbarAd" />
                <div className="rightbarTitle">在線的朋友</div>
                <ul className="rightbarFriendList">
                    <li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src="assets/person/9.jpeg" alt="" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Kelly</span>
                    </li>
                    <li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src="assets/person/9.jpeg" alt="" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Kelly</span>
                    </li><li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src="assets/person/9.jpeg" alt="" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Kelly</span>
                    </li><li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src="assets/person/9.jpeg" alt="" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Kelly</span>
                    </li><li className="rightbarFriend">
                        <div className="rightbarProfileImgContainer">
                            <img src="assets/person/9.jpeg" alt="" className="rightbarProfileImg" />
                            <span className="rightbarOnline"></span>
                        </div>
                        <span className="rightbarUsername">Kelly</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
