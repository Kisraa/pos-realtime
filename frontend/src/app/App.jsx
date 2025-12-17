import { BrowserRouter, Routes, Route } from 'react-router-dom';
import POSScreen from '../components/screens/POSScreen';
import RealtimeScreen from '../components/screens/RealtimeScreen';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<POSScreen />} />
            <Route path="/realtime" element={<RealtimeScreen />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;