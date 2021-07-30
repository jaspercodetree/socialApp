export const LoginStart = () => {
	return { type: 'LOGIN_START' };
};

export const LoginSuccess = (user) => {
	return { type: 'LOGIN_SUCCESS', payload: user };
};

export const LoginFailure = () => {
	return { type: 'LOGIN_FAILURE' };
};
