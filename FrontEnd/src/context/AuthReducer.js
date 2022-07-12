const AuthReducer = (state, action) => {
	switch (action.type) {
		//登入功能
		case 'LOGIN_START':
			return {
				user: null,
				isFetching: true,
				error: false,
			};
		case 'LOGIN_SUCCESS':
			return {
				user: action.payload,
				isFetching: false,
				error: false,
			};
		case 'LOGIN_FAILURE':
			return {
				user: null,
				isFetching: false,
				error: action.payload,
			};

		//追蹤功能
		case 'FOLLOW':
			return {
				...state,
				user: {
					...state.user,
					followings: [...state.user.followings, action.payload],
				},
			};
		case 'UNFOLLOW':
			return {
				...state,
				user: {
					...state.user,
					followings: state.user.followings.filter(
						(following) => following !== action.payload
					),
				},
			};

		//JWT功能
		case 'REFRESH':
			return {
				...state,
				user: {
					...state.user,
					accessToken: action.payload.accessToken,
					refreshToken: action.payload.refreshToken,
					refreshTokens: [action.payload.refreshToken],
				},
			};
		default:
			return state;
	}
};

export default AuthReducer;
