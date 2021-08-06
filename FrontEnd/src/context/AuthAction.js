export const LoginStart = () => {
	return { type: 'LOGIN_START' };
};

//這裡的回傳payload 應該改成user.data比較好，可以讓前端抓資料時不用多寫.data
export const LoginSuccess = (user) => {
	return { type: 'LOGIN_SUCCESS', payload: user.data };
};

export const LoginFailure = () => {
	return { type: 'LOGIN_FAILURE' };
};