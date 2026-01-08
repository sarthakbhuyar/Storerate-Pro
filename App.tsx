
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { mockApi } from './services/mockApi';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import UserDashboard from './pages/User';
import StoreOwner from './pages/Owner';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockApi.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    mockApi.logout();
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onAuthSuccess={setCurrentUser} />;
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {currentUser.role === UserRole.ADMIN && <Admin />}
      {currentUser.role === UserRole.USER && <UserDashboard user={currentUser} />}
      {currentUser.role === UserRole.OWNER && <StoreOwner user={currentUser} />}
    </Layout>
  );
};

export default App;
