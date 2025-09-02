import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Plans from './components/Plans'; 
import Trainers from './components/Trainers';// New members page
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar />
          <Routes>
            {/* Default dashboard is at "/" */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/trainers" element={<Trainers />} />
            {/* You can add more routes later */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
