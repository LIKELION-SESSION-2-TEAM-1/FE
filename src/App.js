import './assets/css/styles.module.css';
import frame from './AppFrame.module.css';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import NavBar from './components/NavBar/NavBar.jsx'
import Home from './pages/OnBoarding/Home/Home';
import Chatting from './pages/Chatting/Chatting.jsx';

function App() {
    return (
        <div className={frame.appShell}>
            <div className={frame.device}>
                <div className={frame.background} />
                <div className={frame.scrollArea}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Chat" element={<Chatting />} />
                    </Routes>
                </div>
                 <NavBar />
            </div>
        </div>
    );
}

export default App;