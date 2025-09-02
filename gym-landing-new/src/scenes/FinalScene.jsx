
// src/App.js
import React from 'react';
import './App.css';
import Scene1Landing from './scenes/Scene1Landing';
// Later: import Scene2BicepCurl, Scene3Squat, Scene4Deadlift

function App() {
  return (
    <div className="App">
      <Scene1Landing />
      {/* Add other scenes below as you complete them */}
      {/* <Scene2BicepCurl /> */}
      {/* <Scene3Squat /> */}
      {/* <Scene4Deadlift /> */}
    </div>
  );
}

export default App;
