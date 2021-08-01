import './share.css';
import { PermMedia, Label, Room, EmojiEmotions } from '@material-ui/icons';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

export default function share() {
	// const { user } = useContext(AuthContext);

	return (
		<div className="share">
			<div className="shareWrapper">
				<div className="shareTop">
					<img
						src="/assets/person/8.jpeg"
						alt=""
						className="shareProfileImg"
					/>
					<input
						// placeholder={`${user.data.username} 你今天過得好嗎?`}
						className="shareInput"
					/>
				</div>
				<hr className="shareHr" />
				<div className="shareBottom">
					<div className="shareOptions">
						<div className="shareOption">
							<PermMedia
								htmlColor="tomato"
								className="shareIcon"
							/>
							<span className="shareOptionText">照片或影片</span>
						</div>
						<div className="shareOption">
							<Label htmlColor="green" className="shareIcon" />
							<span className="shareOptionText">標籤</span>
						</div>
						<div className="shareOption">
							<Room htmlColor="blue" className="shareIcon" />
							<span className="shareOptionText">位置</span>
						</div>
						<div className="shareOption">
							<EmojiEmotions
								htmlColor="orange"
								className="shareIcon"
							/>
							<span className="shareOptionText">心情</span>
						</div>
					</div>
					<button className="shareButton">Share</button>
				</div>
			</div>
		</div>
	);
}
