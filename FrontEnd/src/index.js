import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AxiosJWTConfig } from './AxiosJWTConfig';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.render(
	<AuthContextProvider>
		<AxiosJWTConfig>
			<App />
		</AxiosJWTConfig>
	</AuthContextProvider>,
	document.getElementById('root')
);
