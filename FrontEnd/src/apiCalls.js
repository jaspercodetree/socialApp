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
