
import "./global.css";
import SideSheet from "./_MyComponents/SideSheet";
export const metadata = {
  title: "PWA-Gallery",
  description: "A New Ai Gallery to Manage All your Favourite Memories",
};

import ImageModel from "./_MyComponents/AlbumsComponent/ImageModel";
import Filter from "./_MyComponents/Filter";
import NavBar from "./_MyComponents/NavBar";
import SideFilterLayout from "./_MyComponents/SideFilterLayout";
import { UserProvider } from "./_lib/context";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/toaster"; 
import LayoutWrapper from "./_MyComponents/LayoutWrapper";

export default async function RootLayout({ children,}) {
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Knewave&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <UserProvider>
          <ImageModel />

          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
