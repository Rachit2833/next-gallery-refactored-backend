'use client';

import React from 'react';
import NavBar from './NavBar';
import SideSheet from './SideSheet';
import { usePathname } from 'next/navigation';

const LayoutWrapper = ({ children }) => {
  const pathName = usePathname();

  const noLayoutRoutes = ['/login', '/sign-up', '/not-found'];

  // If current route is in the excluded list, render children only
  if (noLayoutRoutes.includes(pathName)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavBar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <SideSheet />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">
     
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
