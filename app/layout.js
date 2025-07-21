
import "./global.css";
export const metadata = {
  title: "PWA-Gallery",
  description: "A New Ai Gallery to Manage All your Favourite Memories",
};
import ImageModel from "./_MyComponents/AlbumsComponent/ImageModel";
import LayoutWrapper from "./_MyComponents/LayoutWrapper";
import { UserProvider } from "./_lib/context";
import { Toaster } from "@/components/ui/toaster";
import favi from "./favicon.ico"
import { Suspense } from "react";
export default  function RootLayout({ children}) {

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
         <link rel="icon" href={favi.src} />
      </head>
      <body>
        <UserProvider>
       <Suspense>
           <ImageModel />
       </Suspense>
     <Toaster   />
         <Suspense>
           <LayoutWrapper>
            {children}
          </LayoutWrapper>
         </Suspense>
        </UserProvider>
      </body>
    </html>
  );
}
