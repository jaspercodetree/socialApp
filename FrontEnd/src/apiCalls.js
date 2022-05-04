import axios from 'axios';
import { LoginStart, LoginSuccess, LoginFailure } from './context/AuthAction';

export const loginCall = async (userCredential, dispatch) => {
	dispatch(LoginStart());
	try {
		const user = await axios.post('/auth/login', userCredential);
		dispatch(LoginSuccess(user));
		// alert("success");
	} catch (error) {
		dispatch(LoginFailure(error));
		// alert(error);
	}
};

////使用setState的寫法
// export const loginCall = async (userCredential, setState) => {
// 	try {
// 		const user = await axios.post('/auth/login', userCredential);
// 		setState({ user: user.data, isFetching: false, error: false });
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
