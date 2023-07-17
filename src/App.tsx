import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Community from './pages/Community';
import CommunityDetail from './pages/CommunityDetail';
import Writing from './pages/Writing';
import MyPage from './pages/MyPage';
import Account from './pages/Account';
import { authService } from './fbase';

// color: #f7f791

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // onAuthStateChanged()는 사용자의 로그인 상태 변화를 감지하는 메서드
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  return (
    <div>
      <Navigation isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
};

export default App;
