import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" />
      </Routes>
    </div>
  );
};

export default App;
