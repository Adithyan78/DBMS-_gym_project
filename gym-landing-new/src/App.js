import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Scene1Landing from './scenes/Scene1Landing'; // Home page
import Signup from './components/signup/Signup'; // Signup page
import ProfileCom from './components/pages/ProfileCom'; // Profile completion page
import MainProff from './components/pages/MainProff';
import { AuthProvider } from './components/pages/AuthContext';


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Scene1Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfileCom />} />
          <Route path="/main" element={<MainProff />} />
          
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
