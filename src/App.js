import './assets/css/styles.module.css';
import frame from './AppFrame.module.css';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import Landing from './pages/Landing/Landing';
import Home from './pages/OnBoarding/Home/Home';
import ChatList from './pages/Chatting/ChatList/ChatList';
import ChatRoom from './pages/Chatting/ChatRoom/ChatRoom';

import AuthChoice from './pages/AuthChoice/AuthChoice';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';

import Dogeja from './pages/Dogeja/Dogeja';
import Search from './pages/Search/Search';
import MyPage from './pages/MyPage/MyPage';
import TripStyleEdit from './pages/MyPage/TripStyleEdit';

function App() {
    const { pathname } = useLocation();
    // Merge hideHeader conditions: chatlist, chatroom, landing(/), start page, login page, dogeja page, mypage, edit-style
    const hideHeader = pathname === '/chatlist' || pathname === '/chatroom' || pathname === '/' || pathname === '/start' || pathname === '/dogeja' || pathname === '/mypage' || pathname === '/mypage/edit-style';
    const isChatRoom = pathname === '/chatroom';

    // Merge hideNav conditions: dogeja page, landing(/), start, login, signup, mypage, edit-style
    // Note: Incoming changed hideNav logic to use variable. We will combine them.
    const hideNav = pathname === '/dogeja' || pathname === '/' || pathname === '/start' || pathname === '/login' || pathname === '/signup' || pathname === '/mypage' || pathname === '/mypage/edit-style';

    return (
        <div className={frame.appShell}>
            <div className={frame.device}>
                <div className={`${frame.background} ${isChatRoom ? frame.backgroundChat : ''}`} />
                <div className={`${frame.scrollArea} ${pathname === '/' ? frame.noPadding : ''}`}>
                    {!hideHeader && <Header />}
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/chatlist" element={<ChatList />} />
                        <Route path="/chatroom" element={<ChatRoom />} />

                        {/* Auth Routes */}
                        <Route path="/start" element={<AuthChoice />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* New Routes from Main */}
                        <Route path="/dogeja" element={<Dogeja />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/mypage" element={<MyPage />} />
                        <Route path="/mypage/edit-style" element={<TripStyleEdit />} />
                    </Routes>
                </div>
                {!isChatRoom && !hideNav && <NavBar />}
                <img src={require('./assets/pic/Home Indicator.png')} alt="" className={frame.homeIndicator} />
            </div>
        </div>
    );
}

export default App;
