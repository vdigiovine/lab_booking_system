import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import LoginModal from './components/LoginModal';


function App() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simple decode for display
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        setUser(payload);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (username) => {
    setUser({ sub: username });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto py-8">
        <Calendar user={user} />
      </main>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
