/* 編輯/刪除/確認刪除 modal */
import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './alertDialog.css';

import { DropdownButton, Dropdown } from 'react-bootstrap';
import axiosJWT from '../../AxiosJWTConfig';

export default function AlertDialog({ post, editPost, setPosts, username }) {
	const { user, setIsLoading } = useContext(AuthContext);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	//確認 刪除貼文
	const handleDelete = async () => {
		try {
			setIsDeleteModalOpen(false);
			setIsLoading(true);

			await axiosJWT.delete('/posts/' + post._id, {
				data: { userId: user._id },
			});

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

				setIsLoading(false);
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
		</div>
	);
}
