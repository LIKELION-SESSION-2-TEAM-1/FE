import './assets/css/styles.module.css';
import frame from './AppFrame.module.css';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import Home from './pages/OnBoarding/Home/Home';
import ChatList from './pages/Chatting/ChatList/ChatList';
import ChatRoom from './pages/Chatting/ChatRoom/ChatRoom';

function App() {
    const { pathname } = useLocation();
    const hideHeader = pathname === '/chatlist' || pathname === '/chatroom'; //
    const isChatRoom = pathname === '/chatroom';

    return (
        <div className={frame.appShell}>
            <div className={frame.device}>
                <div className={`${frame.background} ${isChatRoom ? frame.backgroundChat : ''}`} />
                <div className={frame.scrollArea}>
                    {!hideHeader && <Header />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chatlist" element={<ChatList />} />
                        <Route path="/chatroom" element={<ChatRoom />} />
                    </Routes>
                </div>
                {!isChatRoom && <NavBar />}
            </div>
        </div>
    );
}

export default App;