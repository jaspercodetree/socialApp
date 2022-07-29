/* 發文元件 */
import './share.css';
import {
	PermMedia,
	Label,
	EmojiEmotions,
	Cancel,
	Search,
} from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRef } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import SearchTagUser from '../searchTagUser/SearchTagUser';
import { Link } from 'react-router-dom';
import axiosJWT from '../../AxiosJWTConfig';
import { checkAndSetFile } from '../../checkAndSetFile';

export default function Share({ setPosts, username }) {
	const { user, PF } = useContext(AuthContext);
	const desc = useRef();
	const [file, setFile] = useState(null);

	const [emojiModalShow, setEmojiModalShow] = useState(false);

	let [newPost, setNewPost] = useState({ userId: user._id });

	const [tagModalShow, setTagModalShow] = useState(false);
	const [searchName, setSearchName] = useState([]);
	const [searchTagUsers, setSearchTagUsers] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [tagUserName, setTagUserName] = useState('');

	//searchTagUsers
	useEffect(() => {
		if (searchName.length !== 0) {
			const getUsers = async () => {
				await axios
					.get(`/users/search?username=${searchName}`)
					.then((res) => setSearchTagUsers(res.data))
					.catch((err) => console.log(err));
			};
			getUsers();
		}
	}, [searchName]);

	//get all users except master
	useEffect(() => {
		const getAllUsers = async () => {
			await axios
				.get(`/users/all`)
				.then((res) => {
					const usersExceptMaster = res.data.filter(
						(item) => item._id !== user._id
					);
					setAllUsers(usersExceptMaster.slice(0, 5));
				})
				.catch((err) => console.log(err));
		};
		getAllUsers();
	}, [user._id]);

	//get tagUserName
	useEffect(() => {
		const getTagUserName = async () => {
			await axios
				.get(`/users?userId=${newPost.tagUserId}`)
				.then((res) => setTagUserName(res.data.username))
				.catch((err) => console.log(err));
		};
		newPost.tagUserId && getTagUserName();
	}, [newPost.tagUserId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log(newPost);

		//1.透過/upload將圖片上傳到資料夾，並將路徑名稱存到newPost；2.再將newPost 透過/posts上傳到資料庫
		if (file) {
			const data = new FormData();
			const filename = Date.now() + file.name;
			data.append('name', filename);
			data.append('file', file);

			newPost.img = filename;
			console.log(newPost);

			try {
				await axiosJWT.post('/upload', data);
			} catch (error) {
				console.log(error);
			}
		}

		try {
			await axiosJWT.post('/posts', newPost);

			//刪除share暫存
			setNewPost({ userId: user._id });
			desc.current.value = '';
			setFile(null);

			//重新獲取貼文 (有收到username 則判斷為使用者個人頁面；否則為使用者共同貼圖牆頁面)
			const getPosts = async () => {
				const res = username
					? await axios.get('/posts/profile/' + username)
					: await axios.get('/posts/timeline/' + user._id);

				//依貼文時間排序
				setPosts(
					res.data.sort((p1, p2) => {
						if (new Date(p1.createdAt) > new Date(p2.createdAt))
							return -1;
						if (new Date(p1.createdAt) < new Date(p2.createdAt))
							return 1;
						return 0;
					})
				);
			};
			getPosts();
		} catch (error) {
			console.log(error);
		}
	};

	//emoji
	function getEmoji(e) {
		// console.log(e.target.querySelector('img').src.split('/images')[1]);
		// console.log(e.target.querySelector('span').textContent);

		setNewPost({
			...newPost,
			//只存PF後的路徑
			emojiImg: e.target.querySelector('img').src.split('/images')[1],
			emojiText: e.target.querySelector('span').textContent,
		});
		setEmojiModalShow(false);
		// console.log(newPost);
		// if (e.target !== this) return false;
	}

	//location
	// let latitude = '';
	// let longitude = '';
	// function getLocation() {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.getCurrentPosition(showPosition);
	// 	} else {
	// 		console.log('Geolocation is not supported by this browser.');
	// 	}
	// }

	// function showPosition(position) {
	// 	latitude = position.coords.latitude;
	// 	longitude = position.coords.longitude;
	// 	console.log(latitude, longitude);
	// }

	return (
		<div className="share">
			<form className="shareWrapper" onSubmit={handleSubmit}>
				<div className="shareTop">
					<img
						src={
							user.profilePicture
								? PF + `person/${user.profilePicture}`
								: PF + `person/noAvatar.png`
						}
						alt=""
						className="shareProfileImg"
					/>
					<div className="d-flex flex-column w-100">
						<div>
							{(newPost.emojiImg || newPost.tagUserId) && (
								<>
									<span className="postUsername">
										{user.username}
									</span>
								</>
							)}
							{newPost.emojiImg && (
								<>
									<span className="emojiWrapper">
										<span className="postEmojiImg">
											正在
											<img
												className="mx-1 "
												src={PF + newPost.emojiImg}
												alt=""
											/>
										</span>
										<span>
											覺得
											<span className="postEmojiText fw-bold mx-1">
												{newPost.emojiText}。
											</span>
										</span>
									</span>
								</>
							)}
							{newPost.tagUserId && (
								<span className="tagUserWrapper">
									<span>
										──和
										<Link to={`/profile/${tagUserName}`}>
											<span className="tagUserName fw-bold ms-2 text-black">
												{tagUserName}
											</span>
										</Link>
										。
									</span>
								</span>
							)}
						</div>
						<div className="sharePostWrapper py-2 position-relative">
							<textarea
								rows="1"
								className="sharePostInput d-block"
								placeholder={`${user.username} 今天coding了嗎 ?`}
								onChange={(e) => {
									setNewPost({
										...newPost,
										desc: desc.current.value,
									});

									//自適應高度
									e.target.style.height = 'auto';
									e.target.style.height = `${e.target.scrollHeight}px`;
								}}
								// onKeyDown={(e) => {
								// 	setNewPost({
								// 		...newPost,
								// 		userId: user._id,
								// 		desc: desc.current.value,
								// 	});
								// }}
								ref={desc}
							></textarea>
						</div>
					</div>
				</div>
				<hr className="shareHr" />
				{/* 上傳圖片預覽 */}
				{file && (
					<div className="shareImgContainer">
						<div className="shareImgWrap position-relative">
							<img
								className="shareImg"
								src={URL.createObjectURL(file)}
								alt=""
							/>
							<Cancel
								className="shareCancelImg"
								style={{ fontSize: '28px' }}
								onClick={() => setFile(null)}
							/>
						</div>
					</div>
				)}
				<div className="shareBottom">
					<div className="shareOptions">
						<label htmlFor="uploadFile" className="shareOption">
							<PermMedia
								htmlColor="tomato"
								className="shareIcon"
							/>
							<input
								style={{ display: 'none' }}
								type="file"
								name="uploadFile"
								id="uploadFile"
								accept=".png, .jpg, .jpeg, .gif"
								onChange={(e) =>
									checkAndSetFile(e.target) &&
									setFile(e.target.files[0])
								}
							/>
						</label>
						<div
							className="shareOption"
							onClick={() => setTagModalShow(true)}
						>
							<Label htmlColor="green" className="shareIcon" />
						</div>
						{/* <div className="shareOption" onClick={getLocation}>
							<Room htmlColor="blue" className="shareIcon" />
						</div> */}
						<div
							className="shareOption"
							onClick={() => setEmojiModalShow(true)}
						>
							<EmojiEmotions
								htmlColor="orange"
								className="shareIcon"
							/>
						</div>
					</div>
					{/* share中有文字或圖片才能發文 */}
					<button
						className={`shareButton ${
							(desc.current && desc.current.value !== '') ||
							file !== null
								? ''
								: 'disabled'
						}`}
						type="submit"
						disabled={
							(desc.current && desc.current.value !== '') ||
							file !== null
								? false
								: true
						}
					>
						分享
					</button>
				</div>
			</form>

			<Modal
				className="emojiModal"
				show={emojiModalShow}
				onHide={() => setEmojiModalShow(false)}
				dialogClassName="modal-90w"
				aria-labelledby="example-custom-modal-styling-title"
				centered={true}
			>
				<Modal.Header closeButton>
					<Modal.Title
						id="example-custom-modal-styling-title"
						className="fs-5 "
					>
						你現在感受如何？
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="container-fluid">
					<ul className="row p-0 m-0">
						{[
							{ img: '10065', text: '開心' },
							{ img: '10001', text: '被祝福' },
							{ img: '10035', text: '感恩' },
							{ img: '10089', text: '充滿希望' },
							{ img: '10001', text: '被愛' },
							{ img: '10052', text: '興奮' },
							{ img: '10001', text: '戀愛 ing' },
							{ img: '10002', text: '抓狂' },
							{ img: '10027', text: '悲傷' },
							{ img: '10088', text: '幸運' },
							{ img: '10001', text: '可愛' },
							{ img: '10093', text: '幸福' },
							{ img: '10022', text: '傻呼呼' },
							{ img: '10023', text: '好夢幻' },
							{ img: '10014', text: '超人' },
							{ img: '10090', text: '喜氣洋洋' },
						].map((item) => (
							<li
								key={item.text}
								className="col-6"
								onClick={getEmoji}
							>
								<div className="box d-flex justify-content-start align-items-center p-2">
									<div
										className="emojiItem"
										onClick={(e) => {
											e.stopPropagation();
											setNewPost({
												...newPost,
												emojiImg: e.target.parentNode
													.querySelector('img')
													.src.split('/images')[1],
												emojiText:
													e.target.parentNode.querySelector(
														'span'
													).textContent,
											});
											setEmojiModalShow(false);
										}}
									>
										<img
											src={PF + `emoji/${item.img}.png`}
											alt=""
											onClick={(e) => {
												e.stopPropagation();
												setNewPost({
													...newPost,
													emojiImg:
														e.target.parentNode
															.querySelector(
																'img'
															)
															.src.split(
																'/images'
															)[1],
													emojiText:
														e.target.parentNode.parentNode.querySelector(
															'span'
														).textContent,
												});
												setEmojiModalShow(false);
											}}
										/>
									</div>
									<div
										className="textItem"
										onClick={(e) => {
											e.stopPropagation();
											setNewPost({
												...newPost,
												emojiImg: e.target.parentNode
													.querySelector('img')
													.src.split('/images')[1],
												emojiText:
													e.target.parentNode.querySelector(
														'span'
													).textContent,
											});
											setEmojiModalShow(false);
										}}
									>
										<span
											onClick={(e) => {
												e.stopPropagation();
												setNewPost({
													...newPost,
													emojiImg:
														e.target.parentNode.parentNode
															.querySelector(
																'img'
															)
															.src.split(
																'/images'
															)[1],
													emojiText:
														e.target.parentNode.parentNode.querySelector(
															'span'
														).textContent,
												});
												setEmojiModalShow(false);
											}}
										>
											{item.text}
										</span>
									</div>
								</div>
							</li>
						))}
					</ul>
				</Modal.Body>
			</Modal>

			<Modal
				className="tagModal"
				show={tagModalShow}
				onHide={() => setTagModalShow(false)}
				dialogClassName="modal-90w"
				centered={true}
			>
				<Modal.Header closeButton>
					<Modal.Title
						id="example-custom-modal-styling-title"
						className="fs-5 "
					>
						標註用戶
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="container-fluid">
					<div className="searchBar">
						<Search className="searchIcon" />
						<input
							type="text"
							className="searchInput bg-transparent"
							onChange={(e) => setSearchName(e.target.value)}
							placeholder={`搜尋使用者`}
						/>
					</div>
					<h6 className={`pt-3 pb-1 px-3 m-0 `}>
						{`${searchName.length === 0 ? '推薦用戶' : '搜尋結果'}`}
					</h6>
					<div
						className={`searchTagUserListWrap bg-white pb-3 mt-1border border-gray rounded-3`}
					>
						<ul className="searchTagUserList m-0 p-0">
							{searchName.length === 0
								? allUsers.map((u) => (
										<SearchTagUser
											className="text-black"
											key={u._id}
											user={u}
											setNewPost={setNewPost}
											newPost={newPost}
											setTagModalShow={setTagModalShow}
										/>
								  ))
								: searchTagUsers.map((u) => (
										<SearchTagUser
											className="text-black"
											key={u._id}
											user={u}
											setNewPost={setNewPost}
											newPost={newPost}
											setTagModalShow={setTagModalShow}
										/>
								  ))}
						</ul>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
