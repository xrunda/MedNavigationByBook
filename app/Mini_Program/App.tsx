import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ConsultationResult from './pages/ConsultationResult';
import Measure from './pages/Measure';
import Report from './pages/Report';
import Plan from './pages/Plan';
import HealthProfile from './pages/HealthProfile';
import UserProfile from './pages/UserProfile';
import BottomNav from './components/BottomNav';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  // Hide bottom nav on specific pages
  const hideNavRoutes = ['/', '/chat', '/result', '/report'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background-light text-slate-900 font-display flex justify-center">
      <div className="w-full max-w-md bg-background-light min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {children}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/result" element={<ConsultationResult />} />
          <Route path="/measure" element={<Measure />} />
          <Route path="/report" element={<Report />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/health-profile" element={<HealthProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;