import React, { useContext, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MoreVert } from '@material-ui/icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import jwt_decode from 'jwt-decode';
import './alertDialog.css';

import { DropdownButton, Dropdown } from 'react-bootstrap';

export default function AlertDialog({ post, editPost }) {
	const { user: currentUser, dispatch } = useContext(AuthContext);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	//delete JWT
	const refreshToken = async () => {
		try {
			const res = await axios.post('/auth/refresh', {
				token: currentUser.refreshToken,
			});
			dispatch({
				type: 'REFRESH',
				payload: {
					accessToken: res.data.accessToken,
					refreshToken: res.data.refreshToken,
				},
			});
			// setUser({
			// 	...currentUser._doc,
			// 	accessToken: res.data.accessToken,
			// 	refreshToken: res.data.refreshToken,
			// });
			return res.data;
		} catch (err) {
			console.log(err);
		}
	};

	//新建一種axios名為axiosJWT，作為需要使用截斷器驗證時使用的axios
	const axiosJWT = axios.create();

	//透過使用axios 的方法interceptors攔截器，在我執行需要驗證accessToken的API時(例如此處為delete)，
	//我讓這個axiosJWT在發出請求前request先被截斷，先行驗證下面這個程式
	//去判斷user.accessToken.exp到期時間 是否已經小於現在的時間(秒數)，如果是的話代表已經到期，這時候則去執行refreshToken()
	//拿新的accessToken，將它存在config.headers['authorization']
	axiosJWT.interceptors.request.use(
		async (config) => {
			let currentDate = new Date();
			const decodedToken = jwt_decode(currentUser.accessToken);
			console.log(jwt_decode(currentUser.accessToken));
			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				const data = await refreshToken();
				config.headers['authorization'] = 'Bearer ' + data.accessToken;
			}
			console.log('config', config);
			return config;
		},
		//假使出現錯誤的話執行
		(error) => {
			return Promise.reject(error);
		}
	);

	const handleDelete = async () => {
		try {
			await axiosJWT.delete('/posts/' + post._id, {
				headers: { authorization: 'Bearer ' + currentUser.accessToken },
				data: { userId: currentUser._id },
			});
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<DropdownButton
				title=""
				variant="light"
				id="bg-nested-dropdown"
				className="border-0"
			>
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
					onClick={handleClickOpen}
				>
					刪除貼文
				</Dropdown.Item>
			</DropdownButton>

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle id="alert-dialog-title">
					{'確定刪除此貼文 ?'}
				</DialogTitle>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						取消
					</Button>
					<Button onClick={handleDelete} color="primary" autoFocus>
						確定
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
