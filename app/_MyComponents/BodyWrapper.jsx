'use client'
import React, { Suspense, useEffect } from 'react';
import {  useUser } from '../_lib/context';
import ImageModel from './AlbumsComponent/ImageModel';
import { Toaster } from '@/components/ui/toaster';
import LayoutWrapper from './LayoutWrapper';
import { themes } from '../_lib/themes';

const BodyWrapper = ({children,user}) => {
    const {selectedTheme, setSelectedTheme,isDark, setIsDark, personalDetails, setPersonalDetails} =useUser()
   useEffect(()=>{
    console.log("hello",user?.seoPrivacy);
     setPersonalDetails(user?.seoPrivacy)

   },[user])
   console.log(user,"pd");
  return (
      <body className={`${themes[selectedTheme].lightClass} ${isDark?"dark":""}`}>
      
       <Suspense>
           <ImageModel />
       </Suspense>
     <Toaster   />
         <Suspense>
           <LayoutWrapper image={user.profilePicture}>
            {children}
          </LayoutWrapper>
         </Suspense>
      </body>
  );
};

export default BodyWrapper;