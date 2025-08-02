'use client';

import React from 'react';
import NavBar from './NavBar';
import SideSheet from './SideSheet';
import { usePathname } from 'next/navigation';
import { avatarImages } from '../_lib/avatar';

const LayoutWrapper = ({ children,image }) => {
  const pathName = usePathname();

  const noLayoutRoutes = ['/login', '/sign-up', '/not-found'];

  // If current route is in the excluded list, render children only
  if (noLayoutRoutes.includes(pathName)) {
    return <>{children}</>;
  }

  let profilImage
  if (!isNaN(Number(image)) && avatarImages[Number(image)]) {
    profilImage = avatarImages[Number(image)];
  }
  console.log(profilImage,"pimg");
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavBar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <SideSheet profileImage={profilImage} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0">

          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
