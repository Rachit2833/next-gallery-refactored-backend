"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Album, Camera, Heart, Home, Map, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../_lib/context';

function NavBar() {
   const pathname = usePathname();
   const { setSelectedImages, setOpenCamera, setVideoSrc } = useUser()

   useEffect(() => {
      setSelectedImages([])
      setOpenCamera(false)
      setVideoSrc(null)
   }, [pathname])

   useEffect(() => {

   })
   const navigationItems = [
      {
         name: "Albums",
         icon: Album, // Directly reference the icon component
         href: "/albums",
      },
      {
         name: "People & Sharing",
         icon: Users, // Example, update this with the actual profile icon if needed
         href: "/people",
      },
      {
         name: "Favourites",
         icon: Heart,
         href: "/favourites",
      },
      {
         name: "Memory-Map",
         icon: Map, // Example, update this with the actual cart icon if needed
         href: "/memory-map",
      },
      {
         name: "Post",
         icon: Camera, // Example, update this with the actual profile icon if needed
         href: "/post",
      },
   ];

   const currentPath = usePathname(); // Get current route
   return (
      pathname === "/login" || pathname === "/sign-up" | pathname === "/not-found" ? null : <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
         <nav className="flex flex-col items-center gap-4 px-2 py-4">
            <Link
               href="/"
               className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full ${currentPath === "/"
                  ? "bg-primary text-white" // Active styles
                  : "bg-transparent text-black" // Non-active styles
                  } text-lg font-semibold md:h-8 md:w-8 md:text-base`}
            >
               <Home className="h-4 w-4 transition-all group-hover:scale-110" />
               <span className="sr-only">Home</span>
            </Link>

            <TooltipProvider>
               {navigationItems.map((item, index) => {
                  return (
                     <Tooltip key={index}>
                        <TooltipTrigger asChild>
                           <Link
                              href={item.href}
                              className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full ${`/${currentPath.split("/")[1]}` === item.href
                                 ? "bg-primary text-white" // Active styles
                                 : "bg-transparent text-black" // Non-active styles
                                 } text-lg font-semibold md:h-8 md:w-8 md:text-base`}
                           >
                              <item.icon className="h-4 w-4 transition-all group-hover:scale-110" />
                              <span className="sr-only">{item.name}</span>
                           </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                           {item.name}
                        </TooltipContent>
                     </Tooltip>
                  );
               })}
            </TooltipProvider>
         </nav>

         <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                     >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                     </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </nav>
      </aside>
   );
}

export default NavBar;