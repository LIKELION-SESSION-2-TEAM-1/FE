import './assets/css/styles.module.css';
import frame from './AppFrame.module.css';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import Home from './pages/OnBoarding/Home/Home';
import Chatting from './pages/Chatting/Chatting.jsx';

function App() {
    const { pathname } = useLocation();
    const isChat = pathname == '/chat';

    return (
        <div className={frame.appShell}>
            <div className={frame.device}>
                <div className={`${frame.background} ${isChat ? frame.backgroundChat : ''}`} />
                <div className={frame.scrollArea}>
                    {!isChat && <Header />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chatting />} />
                    </Routes>
                </div>
                {!isChat && <NavBar />}
            </div>
        </div>
    );
}

export default App;