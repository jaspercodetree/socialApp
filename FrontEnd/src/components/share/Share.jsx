import './share.css';
import { PermMedia, Label, Room, EmojiEmotions } from '@material-ui/icons';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRef } from 'react';
import axios from 'axios';

export default function Share() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user } = useContext(AuthContext);
	const desc = useRef();
	const [file, setFile] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newPost = {
			userId: user.data._id,
			desc: desc.current.value,
		};

		//1.透過/upload將圖片上傳到資料夾，並將路徑名稱存到newPost；2.再將newPost 透過/posts上傳到資料庫
		if (file) {
			const data = new FormData();
			const filename = Date.now() + file.name;
			data.append('name', filename);
			data.append('file', file);
			newPost.img = filename;
			console.log(newPost);
			try {
				await axios.post('/upload', data);
			} catch (error) {
				console.log(error);
			}
		}

		try {
			await axios.post('/posts', newPost);
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="share">
			<form className="shareWrapper" onSubmit={handleSubmit}>
				<div className="shareTop">
					<img
						src={
							user.data.profilePicture
								? PF + `person/${user.data.profilePicture}`
								: PF + `person/noAvatar.png`
						}
						alt=""
						className="shareProfileImg"
					/>
					<input
						placeholder={`${user.data.username} 你今天過得好嗎?`}
						className="shareInput"
						ref={desc}
					/>
				</div>
				<hr className="shareHr" />
				<div className="shareBottom">
					<div className="shareOptions">
						<label htmlFor="uploadFile" className="shareOption">
							<PermMedia
								htmlColor="tomato"
								className="shareIcon"
							/>
							<span className="shareOptionText">照片</span>
							<input
								style={{ display: 'none' }}
								type="file"
								name="uploadFile"
								id="uploadFile"
								accept=".png, .jpg, .jpeg"
								onChange={(e) => setFile(e.target.files[0])}
							/>
						</label>
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
					<button className="shareButton" type="submit">
						分享
					</button>
				</div>
			</form>
		</div>
	);
}
