import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SocialLinksModal from './SocialLinksModal';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSocialLinksOpen, setIsSocialLinksOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSocialLinks = () => {
    setIsSocialLinksOpen(true);
  };

  const closeSocialLinks = () => {
    setIsSocialLinksOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#212121] overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onOpenSocialLinks={openSocialLinks}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar}
          onOpenSocialLinks={openSocialLinks}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <SocialLinksModal 
        isOpen={isSocialLinksOpen}
        onClose={closeSocialLinks}
      />
    </div>
  );
};

export default Layout;
