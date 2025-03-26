import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GitLabIntegration from './pages/GitLabIntegration';
import AIReport from './pages/AIReport';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gitlab" element={<GitLabIntegration />} />
        <Route path="/ai" element={<AIReport />} />
        <Route path="/*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
