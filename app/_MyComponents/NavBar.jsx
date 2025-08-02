'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Album,
  Camera,
  Heart,
  Home,
  Map,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../_lib/context';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function NavBar() {
  const pathname = usePathname();
  const { setSelectedImages, setOpenCamera, setVideoSrc ,isDark,setIsDark} = useUser();

  useEffect(() => {
    setSelectedImages([]);
    setOpenCamera(false);
    setVideoSrc(null);
  }, [pathname]);

  const navigationItems = [
    { name: 'Albums', icon: Album, href: '/albums' },
    { name: 'People & Sharing', icon: Users, href: '/people' },
    { name: 'Favourites', icon: Heart, href: '/favourites' },
    { name: 'Memory-Map', icon: Map, href: '/memory-map' },
    { name: 'Post', icon: Camera, href: '/post' },
  ];

  const currentPath = usePathname();
  const isExcludedRoute =
    pathname === '/login' || pathname === '/sign-up' || pathname === '/not-found';

  if (isExcludedRoute) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/"
          className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full ${
            currentPath === '/'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted text-muted-foreground'
          } transition-colors`}
        >
          <Home className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Home</span>
        </Link>

        <TooltipProvider>
          {navigationItems.map((item, index) => {
            const isActive = `/${currentPath.split('/')[1]}` === item.href;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    } transition-colors`}
                  >
                    <item.icon className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
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
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
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
