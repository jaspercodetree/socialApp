import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

//新建一種axios名為axiosJWT，作為需要使用截斷器驗證時使用的axios
const axiosJWT = axios.create();

const AxiosJWTConfig = ({ children }) => {
	const { user: currentUser, dispatch } = useContext(AuthContext);

	//!大坑 interceptors會一直重複run，因此用完要關閉
	// console.log(axios.interceptors.request.handlers);
	if (axiosJWT.interceptors.request.handlers.length > 0) {
		axiosJWT.interceptors.request.handlers = [];
	}

	//delete JWT
	const refreshToken = async () => {
		try {
			const res = await axios.post('/auth/refresh', {
				token: currentUser.refreshToken,
				refreshTokens: currentUser.refreshTokens,
			});

			//更新useContext user data
			await dispatch({
				type: 'REFRESH',
				payload: {
					accessToken: res.data.accessToken,
					refreshToken: res.data.refreshToken,
					refreshTokens: [res.data.refreshToken],
				},
			});
			// 以上類似 setUser({
			// 	...currentUser._doc,
			// 	accessToken: res.data.accessToken,
			// 	refreshToken: res.data.refreshToken,
			// });
			console.log(currentUser);
			console.log(res.data);

			return res.data;
		} catch (err) {
			console.log(err);
		}
	};

	//透過使用axios 的方法interceptors攔截器，在我執行需要驗證accessToken的API時(例如此處為delete)，
	//我讓這個axiosJWT在發出請求前request先被截斷，先行驗證下面這個程式
	//去判斷user.accessToken.exp到期時間 是否已經小於現在的時間(秒數)，如果是的話代表已經到期，這時候則去執行refreshToken()
	//拿新的accessToken，將它存在config.headers['authorization']
	axiosJWT.interceptors.request.use(
		async (config) => {
			// console.log(axiosJWT.interceptors.request.handlers);
			let currentDate = new Date();

			const decodedToken = jwt_decode(currentUser.accessToken);
			console.log(jwt_decode(currentUser.accessToken));

			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				let data = await refreshToken();
				console.log(data);

				//更新 new accessToken
				config.headers['authorization'] = 'Bearer ' + data.accessToken;
			}
			console.log('config', config);
			return config;
		},
		//假使出現錯誤的話執行
		(error) => {
			return Promise.reject(error);
		}
	);

	return children;
};

export default axiosJWT;
export { AxiosJWTConfig };
