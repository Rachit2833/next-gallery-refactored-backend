import React from 'react';
import AppSideBar from '../_MyComponents/AppSideBar';

const Layout = ({children}) => {
  return (
     <div className="grid md:grid-cols-[280px_1fr] h-screen">
      <AppSideBar />
      {children}
    </div>
  );
};

export default Layout;