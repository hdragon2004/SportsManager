import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RealtimeNotification from '../components/RealtimeNotification';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <RealtimeNotification />
      <Header className="fixed top-0 left-0 right-0 z-50" />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 