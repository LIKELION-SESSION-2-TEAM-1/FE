import './assets/css/styles.module.css';
import frame from './AppFrame.module.css';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header/Header.jsx'
import Home from './pages/OnBoarding/Home/Home';

function App() {
    return (
        <div className={frame.appShell}>
            <div className={frame.device}>
                <div className={frame.background} />
                <div className={frame.scrollArea}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;