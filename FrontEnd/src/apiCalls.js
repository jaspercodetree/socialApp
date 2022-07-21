import axios from 'axios';
import { LoginStart, LoginSuccess, LoginFailure } from './context/AuthAction';

export const loginCall = async (userCredential, dispatch) => {
	dispatch(LoginStart());

	await axios
		.post('/auth/login', userCredential)
		.then((res) => {
			dispatch(LoginSuccess(res.data));
		})
		.catch((error) => {
			dispatch(LoginFailure('帳號或密碼錯誤，請重新輸入'));
			// console.log(error);
		});
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
