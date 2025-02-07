import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ChatInterface from './components/chat/ChatInterface';
import { ReactElement } from 'react';
import React from 'react';

const App: React.FC = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
};

export default App;