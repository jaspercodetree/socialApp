import { createContext, useReducer, useEffect } from 'react';
import AuthReducer from './AuthReducer';

//宣告初始狀態
const INITIAL_STATE = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	isFetching: false,
	error: false,
};

//輸出context
export const AuthContext = createContext(INITIAL_STATE);

//輸出context.provider
export const AuthContextProvider = ({ children }) => {
	//引入reducer
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	// console.log(state.user);
	//將登入後的拿到的user 轉JSON存在localstorage
	useEffect(() => {
		localStorage.setItem('user', JSON.stringify(state.user));
	}, [state.user]);

	return (
		<AuthContext.Provider
			value={{
				user: state.user,
				isFetching: state.isFetching,
				error: state.error,
				dispatch,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
