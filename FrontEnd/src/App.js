import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
	const { user, error } = useContext(AuthContext);

	return (
		<Router>
			<Switch>
				<Route exact path="/">
					{user ? <Home /> : <Login />}
				</Route>
				<Route path="/login">
					{user ? <Redirect to="/" /> : <Login error={error} />}
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				{/* isPersonalInfo 分別個人頁面與編輯個人頁面 */}
				<Route exact path="/profile/:username">
					<Profile />
				</Route>
				<Route path="/profile/:username/personalInfo">
					<Profile isPersonalInfo={true} />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
