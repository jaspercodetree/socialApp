import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import jwt_decode from 'jwt-decode';
import './alertDialog.css';

import { DropdownButton, Dropdown } from 'react-bootstrap';
// import axiosJWT, { AxiosJWTConfig } from '../../AxiosJWTConfig';

export default function AlertDialog({ post, editPost, setPosts }) {
	const { user: currentUser, dispatch } = useContext(AuthContext);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isFailModalOpen, setIsFailModalOpen] = useState(false);

	// //JWT verify
	// AxiosJWTConfig({ setIsDeleteModalOpen, setIsFailModalOpen });

	//新建一種axios名為axiosJWT，作為需要使用截斷器驗證時使用的axios
	const axiosJWT = axios.create();

	//delete JWT
	const refreshToken = async () => {
		try {
			const res = await axios.post('/auth/refresh', {
				token: currentUser.refreshToken,
			});

			//更新useContext user data
			dispatch({
				type: 'REFRESH',
				payload: {
					accessToken: res.data.accessToken,
					refreshToken: res.data.refreshToken,
				},
			});
			// 以上類似 setUser({
			// 	...currentUser._doc,
			// 	accessToken: res.data.accessToken,
			// 	refreshToken: res.data.refreshToken,
			// });
			// console.log(currentUser);

			return res.data;
		} catch (err) {
			console.log(err);
			setIsFailModalOpen(true);
		}
	};

	//透過使用axios 的方法interceptors攔截器，在我執行需要驗證accessToken的API時(例如此處為delete)，
	//我讓這個axiosJWT在發出請求前request先被截斷，先行驗證下面這個程式
	//去判斷user.accessToken.exp到期時間 是否已經小於現在的時間(秒數)，如果是的話代表已經到期，這時候則去執行refreshToken()
	//拿新的accessToken，將它存在config.headers['authorization']
	axiosJWT.interceptors.request.use(
		async (config) => {
			let currentDate = new Date();
			const decodedToken = jwt_decode(currentUser.accessToken);
			// console.log(jwt_decode(currentUser.accessToken));
			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				const data = await refreshToken();

				//更新 new accessToken
				config.headers['authorization'] = 'Bearer ' + data.accessToken;
			}
			// console.log('config', config);
			return config;
		},
		//假使出現錯誤的話執行
		(error) => {
			return Promise.reject(error);
		}
	);

	//確認 刪除貼文
	const handleDelete = async () => {
		try {
			await axiosJWT.delete('/posts/' + post._id, {
				headers: { authorization: 'Bearer ' + currentUser.accessToken },
				data: { userId: currentUser._id },
			});

			const getPosts = async () => {
				const res = await axios.get(
					'/posts/timeline/' + currentUser._id
				);

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
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<DropdownButton title="" id="bg-nested-dropdown">
				<Dropdown.Item
					className="dropdownItem dropdownItemEdit text-center"
					eventKey="2"
					onClick={(e) => editPost(e)}
				>
					編輯貼文
				</Dropdown.Item>
				<Dropdown.Item
					className="dropdownItem dropdownItemDelete text-center"
					eventKey="1"
					onClick={() => setIsDeleteModalOpen(true)}
				>
					刪除貼文
				</Dropdown.Item>
			</DropdownButton>

			<Dialog
				open={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
			>
				<DialogTitle
					id="alert-dialog-title"
					className="pb-0 text-danger"
				>
					{'刪除此篇貼文 ?'}
				</DialogTitle>
				<DialogActions className="justify-content-center">
					<Button onClick={() => setIsDeleteModalOpen(false)}>
						取消
					</Button>
					<Button onClick={handleDelete} autoFocus>
						確定
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={isFailModalOpen}
				onClose={() => setIsFailModalOpen(false)}
			>
				<DialogTitle
					id="alert-dialog-title"
					className="pb-0 text-danger text-center"
				>
					<p className="m-0">權限驗證已逾時</p>
					<p className="m-0">若要刪除貼文，請您重新登入</p>
				</DialogTitle>
				<DialogActions className="justify-content-center">
					<Button
						onClick={() => {
							setIsFailModalOpen(false);
							setIsDeleteModalOpen(false);
						}}
					>
						關閉
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
