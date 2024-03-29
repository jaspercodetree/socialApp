/* 編輯個人資料 */
import './personalInfo.css';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Cancel, Edit, PermMedia } from '@material-ui/icons';
import axiosJWT from '../../AxiosJWTConfig';
import { checkAndSetFile } from '../../checkAndSetFile';

export default function PersonalInfo({ getUser }) {
	const { user, dispatch, PF, setIsLoading } = useContext(AuthContext);

	const [isEditable, setIsEditable] = useState(false);

	const [username, setUsername] = useState(user.username);
	const [email, setEmail] = useState(user.email);
	const [city, setCity] = useState(user.city);
	const [hometown, setHometown] = useState(user.from);
	const [relationship, setRelationship] = useState(user.relationship || 2);
	const [desc, setDesc] = useState(user.desc);
	const [fileProfileImg, setFileProfileImg] = useState(null);
	const [fileCoverImg, setFileCoverImg] = useState(null);

	const editProfile = (e) => {
		e.preventDefault();
		setIsEditable(true);
	};

	const cancelEditInfo = (e) => {
		e.preventDefault();
		setIsEditable(false);

		setUsername(user.username);
		setEmail(user.email);
		setCity(user.city);
		setHometown(user.from);
		setRelationship(user.relationship);
		setDesc(user.desc);

		setFileProfileImg(null);
		setFileCoverImg(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const updateData = {
			userId: user._id,
			username: username,
			email: email,
			city: city,
			from: hometown,
			relationship: relationship,
			desc: desc,
			profilePicture: user.profilePicture,
			coverPicture: user.coverPicture,
		};

		//A-1.透過/upload/person將profile圖片上傳到資料夾，並將路徑名稱存到updateData；2.再將updateData 透過/posts上傳到資料庫
		if (fileProfileImg) {
			const data = new FormData();
			const filename = Date.now() + fileProfileImg.name;
			data.append('name', filename);
			data.append('file', fileProfileImg);

			updateData.profilePicture = filename;
			console.log(updateData);

			try {
				//新增圖片到資料夾
				await axiosJWT.post('/upload/person', data);
				//刪除資料夾原先的圖片
				await axiosJWT.post(`/img/delete`, {
					filename: `person/${user.profilePicture}`,
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			updateData.profilePicture = user.profilePicture;
		}

		//B-cover圖片
		if (fileCoverImg) {
			const data = new FormData();
			const filename = Date.now() + fileCoverImg.name;
			data.append('name', filename);
			data.append('file', fileCoverImg);

			updateData.coverPicture = filename;
			console.log(updateData);

			try {
				//新增圖片到資料夾
				await axiosJWT.post('/upload/person', data);
				//刪除資料夾原先的圖片
				await axiosJWT.post(`/img/delete`, {
					filename: `person/${user.coverPicture}`,
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			updateData.coverPicture = user.coverPicture;
		}

		try {
			//更新資料庫
			await axiosJWT.put(`/users/${user._id}`, updateData);
			//1.user內有新token 2.updateData內有新資料 =>結合最新 useContext user
			// console.log('combine', { ...user, ...updateData });

			//更新useContext
			await dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { ...user, ...updateData },
			});

			//從父層重新獲得新的profile user頁面資料
			getUser();

			//清空暫存圖片
			setFileProfileImg(null);
			setFileCoverImg(null);

			//恢復檢視狀態
			setIsEditable(false);

			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="d-flex align-items-center justify-content-center">
			<form className="personalInfoWrap" onSubmit={handleSubmit}>
				<div className="personalInfoBox row border p-4 mt-3 justify-content-center">
					<div className="col-12">
						<h5 className="fw-bold text-center position-relative mb-4">
							基本資料
							{!isEditable ? (
								<button
									className="personalInfoBtn btn btn-outline-secondary btn-sm rounded-3 ms-3 position-absolute"
									onClick={(e) => {
										editProfile(e);
									}}
								>
									<Edit className="fs-6 me-1" />
									編輯
								</button>
							) : (
								<button
									className="personalInfoBtn btn btn-danger btn-sm rounded-3 ms-3 position-absolute"
									onClick={cancelEditInfo}
								>
									<Cancel className="fs-6 me-1" />
									取消
								</button>
							)}
						</h5>
					</div>
					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="username" className="w-100 fw">
								使用者姓名
							</label>
							<input
								id="username"
								name="username"
								className="w-100"
								type="text"
								required
								disabled
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="userEmail">Email</label>
							<input
								id="userEmail"
								name="userEmail"
								className="w-100"
								type="email"
								required
								disabled={!isEditable}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="userCity">現居</label>
							<input
								id="userCity"
								name="userCity"
								className="w-100"
								type="text"
								required
								disabled={!isEditable}
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="userHometown">來自</label>
							<input
								id="userHometown"
								name="userHometown"
								className="w-100"
								type="text"
								required
								disabled={!isEditable}
								value={hometown}
								onChange={(e) => setHometown(e.target.value)}
							/>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="userRelationship">關係</label>
							<select
								id="userRelationship"
								name="userRelationship"
								className={`w-100 ${
									isEditable && 'selectArrow'
								}`}
								type="text"
								required
								disabled={!isEditable}
								value={relationship}
								onChange={(e) =>
									setRelationship(e.target.value)
								}
							>
								<option value="0">單身</option>
								<option value="1">穩定交往中</option>
								<option value="2">secret</option>
							</select>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8">
							<label htmlFor="userDesc">個人簡介</label>
							<textarea
								id="userDesc"
								name="userDesc"
								className="w-100 py-3"
								rows={2}
								required
								disabled={!isEditable}
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
							></textarea>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8 mb-3">
							<label htmlFor="">大頭貼照</label>
							<div className="border rounded-3">
								<label
									htmlFor="uploadProfileFile"
									className={` ${
										isEditable ? 'd-flex' : 'd-none'
									} align-items-center justify-content-center uploadProfileFileLabel pt-3`}
								>
									<PermMedia
										htmlColor="tomato"
										className=" me-1"
									/>
									重新上傳
									<input
										style={{ display: 'none' }}
										type="file"
										name="uploadProfileFile"
										id="uploadProfileFile"
										className={``}
										accept=".png, .jpg, .jpeg, .gif"
										onChange={(e) => {
											checkAndSetFile(e.target) &&
												setFileProfileImg(
													e.target.files[0]
												);
										}}
									/>
								</label>

								{/* 圖片預覽 */}
								<div className="shareImgContainer">
									<div className="shareImgWrap position-relative">
										{fileProfileImg ? (
											<>
												<img
													className="profileUserImgPreview"
													src={URL.createObjectURL(
														fileProfileImg
													)}
													alt=""
												/>
												<Cancel
													className="shareCancelImg"
													style={{ fontSize: '28px' }}
													onClick={() =>
														setFileProfileImg(null)
													}
												/>
											</>
										) : (
											<img
												className="profileUserImgPreview"
												src={`${
													PF +
													'person/' +
													(user.profilePicture
														? user.profilePicture
														: 'noAvatar.png')
												}`}
												alt=""
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="row justify-content-center">
						<div className="form-group col-12 col-lg-8 mb-3">
							<label htmlFor="userCity">封面照片</label>
							<div className="border rounded-3">
								<label
									htmlFor="uploadCoverFile"
									className={` ${
										isEditable ? 'd-flex' : 'd-none'
									} align-items-center justify-content-center uploadCoverFileLabel pt-3`}
								>
									<PermMedia
										htmlColor="tomato"
										className=" me-1"
									/>
									重新上傳
									<input
										style={{ display: 'none' }}
										type="file"
										name="uploadCoverFile"
										id="uploadCoverFile"
										className={``}
										accept=".png, .jpg, .jpeg, .gif"
										onChange={(e) => {
											checkAndSetFile(e.target) &&
												setFileCoverImg(
													e.target.files[0]
												);
										}}
									/>
								</label>

								{/* 圖片預覽 */}
								<div className="shareImgContainer">
									<div className="shareImgWrap position-relative">
										{fileCoverImg ? (
											<>
												<img
													className="coverUserImgPreview"
													src={URL.createObjectURL(
														fileCoverImg
													)}
													alt=""
												/>
												<Cancel
													className="shareCancelImg"
													style={{ fontSize: '28px' }}
													onClick={() =>
														setFileCoverImg(null)
													}
												/>
											</>
										) : (
											<img
												className="coverUserImgPreview"
												src={`${
													PF +
													'person/' +
													(user.coverPicture
														? user.coverPicture
														: 'noCover.png')
												}`}
												alt=""
											/>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{isEditable && (
						<div className="row justify-content-center">
							<div className="form-group col-12 col-lg-8">
								<button
									className=" col-12 personalInfoSubmitBtn"
									type="submit"
								>
									確定修改
								</button>
							</div>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
