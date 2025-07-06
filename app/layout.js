
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

          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <NavBar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <SideSheet />
              <main className="grid  flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 ">
                <Toaster />
                {children}
              </main>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
