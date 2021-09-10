import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MoreVert } from '@material-ui/icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function AlertDialog({ post }) {
	const { user: currentUser } = useContext(AuthContext);

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = async () => {
		try {
			await axios.delete('/posts/' + post._id, {
				data: { userId: currentUser._id },
			});
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<Button onClick={handleClickOpen}>
				<MoreVert />
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle id="alert-dialog-title">
					{'您是否確定要刪除此貼文 ?'}
				</DialogTitle>
				{/* <DialogContent>
					<DialogContentText id="alert-dialog-description">
						貼文刪除後無法復原
					</DialogContentText>
				</DialogContent> */}
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
