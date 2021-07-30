import { createContext, useReducer } from 'react';
import AuthReducer from './AuthReducer';

//宣告初始狀態
const INITIAL_STATE = {
	user: null,
	isFetching: false,
	error: false,
};

//輸出context
export const AuthContext = createContext(INITIAL_STATE);

//輸出context.provider
export const AuthContextProvider = ({ children }) => {
	//引入reducer
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

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
