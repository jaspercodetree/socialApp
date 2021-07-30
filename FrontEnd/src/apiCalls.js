import axios from 'axios';
import { LoginFailure, LoginStart, LoginSuccess } from './context/AuthAction';

export const loginCall = async (userCredential, dispatch) => {
	dispatch(LoginStart());
	try {
		const user = await axios.post('/auth/login', userCredential);
		dispatch(LoginSuccess(user));
	} catch (error) {
		dispatch(LoginFailure());
	}
};
