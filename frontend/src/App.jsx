import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Chat from './components/Chat';
import ProtectedRoute from './components/common/Protected';
import UserProfile from './components/UserProfile';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/CreateAccount" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path='/UserProfile/:id' element={<UserProfile/>}/>
      </Route>
      {/* Use ProtectedRoute here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
