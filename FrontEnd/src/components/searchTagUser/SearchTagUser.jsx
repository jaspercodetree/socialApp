import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './searchTagUser.css';

export default function SearchTagUser({
	user,
	setNewPost,
	newPost,
	setTagModalShow,
}) {
	const { PF } = useContext(AuthContext);
	return (
		<li
			className="searchTagUser m-0 px-3 py-2"
			data-userid={user._id}
			data-username={user.username}
			onClick={(e) => {
				setNewPost({
					...newPost,
					tagUserId: e.target.getAttribute('data-userid'),
				});
				setTagModalShow(false);
			}}
		>
			<img
				src={
					user.profilePicture
						? PF + 'person/' + user.profilePicture
						: PF + 'person/noAvatar.png'
				}
				alt=""
				className="searchTagUserImg"
				onClick={(e) => {
					setNewPost({
						...newPost,
						tagUserId:
							e.target.parentNode.getAttribute('data-userid'),
					});
					setTagModalShow(false);
				}}
			/>
			<span
				className="searchTagUserName"
				onClick={(e) => {
					setNewPost({
						...newPost,
						tagUserId:
							e.target.parentNode.getAttribute('data-userid'),
					});
					setTagModalShow(false);
				}}
			>
				{user.username}
			</span>
		</li>
	);
}
