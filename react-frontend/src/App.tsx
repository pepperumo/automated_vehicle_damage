import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageDetection from './pages/ImageDetection';
import VideoDetection from './pages/VideoDetection';
import Performance from './pages/Performance';

function App() {
  return (
    <Router>
      <Layout>        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image" element={<ImageDetection />} />
          <Route path="/video" element={<VideoDetection />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
