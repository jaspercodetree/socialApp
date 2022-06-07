export const LoginStart = () => {
	return { type: 'LOGIN_START' };
};

//這裡的回傳payload 資料為user.data (因為是透過axios取得資料，因此資料放在data這層)
export const LoginSuccess = (user) => {
	return { type: 'LOGIN_SUCCESS', payload: user.data };
};

export const LoginFailure = (error) => {
	return { type: 'LOGIN_FAILURE', payload: error };
};
