
import "./global.css";
import ImageModel from "./_MyComponents/AlbumsComponent/ImageModel";
import LayoutWrapper from "./_MyComponents/LayoutWrapper";
import { UserProvider } from "./_lib/context";
import { Toaster } from "@/components/ui/toaster";

import { Suspense } from "react";
export const metadata = {
 title: {
    template: "%s / NextGallery",
    default: " Welcome / NextGallery",
  },
  description: "A modern photo gallery application for organizing and viewing your memories.",
  // keywords: ["photo gallery", "image management", "albums", "memories", "Next.js gallery"],
  // authors: [{ name: "Rachit2833", url: "https://github.com/Rachit2833" }],
  // creator: "Rachit Rawat",
  // themeColor: "#ffffff",
};
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
