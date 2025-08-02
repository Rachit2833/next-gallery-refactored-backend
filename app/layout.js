
import "./global.css";
import ImageModel from "./_MyComponents/AlbumsComponent/ImageModel";
import LayoutWrapper from "./_MyComponents/LayoutWrapper";
import { UserProvider } from "./_lib/context";
import { Toaster } from "@/components/ui/toaster";

import { Suspense } from "react";
import BodyWrapper from "./_MyComponents/BodyWrapper";
import { cookies } from "next/headers";
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
export default async   function RootLayout({ children}) {
    const cookieStore = await cookies();
     const res = await fetch("http://localhost:2833/user/verify-user", {
       method: "POST",
       headers: {
         authorization: `Bearer ${cookieStore.get("session")?.value}`,
       },
       credentials: "include",
       cache: "no-store",
     });
     const user = await res.json();
  
  return (
    <html lang="en" >
      <head >
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
        <UserProvider>
      <BodyWrapper user={user?.user}>
        {children}
      </BodyWrapper>
      </UserProvider>
    </html>
  );
}
