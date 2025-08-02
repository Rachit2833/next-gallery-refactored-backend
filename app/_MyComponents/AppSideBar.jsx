"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useUser } from "../_lib/context";

const AppSideBar = () => {
  const {
    selected,
    setSelected,
    selectedSub,
    setSelectedSub,
    subOption,
    setSubOption,
  } = useUser();

  const [open, setOpen] = useState(false);

  // Hotkeys
  useHotkeys("mod+p", () => {
    setSelected("Profile");
    setSelectedSub(null);
    setSubOption(null);
    setOpen(false);
  });

  useHotkeys("mod+s", () => {
    setSelected("Settings");
    setSelectedSub(null);
    setSubOption(null);
    setOpen(false);
  });

  useHotkeys("shift+mod+q", () => {
    setSelected("Logout");
    setSelectedSub(null);
    setSubOption(null);
    setOpen(false);
  });

  const menuItems = [
    {
      label: "Profile",
      icon: <User className="h-4 w-4" />,
      shortcut: (
        <>
          <kbd className="text-xs bg-accent px-1.5 py-0.5 rounded">⌘</kbd>+
          <kbd className="text-xs bg-accent px-1 py-0.5 rounded ml-0.5">P</kbd>
        </>
      ),
      sub: ["Change Avatar", "Account Info", "Privacy"],
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      shortcut: (
        <>
          <kbd className="text-xs bg-accent px-1.5 py-0.5 rounded">⌘</kbd>+
          <kbd className="text-xs bg-accent px-1 py-0.5 rounded ml-0.5">S</kbd>
        </>
      ),
      sub: ["Appearance", "Notifications", "Security"],
    },
    {
      label: "Logout",
      icon: <LogOut className="h-4 w-4" />,
      shortcut: (
        <>
          <kbd className="text-xs bg-accent px-1.5 py-0.5 rounded">⇧</kbd>+
          <kbd className="text-xs bg-accent px-1.5 py-0.5 rounded">⌘</kbd>+
          <kbd className="text-xs bg-accent px-1 py-0.5 rounded ml-0.5">Q</kbd>
        </>
      ),
      sub: [],
    },
  ];

  const sectionMap = {
    "Change Avatar": "change-avatar",
    "Account Info": "account-info",
    Privacy: "privacy",
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const SidebarContent = () => (
    <div className="h-full w-full max-w-[280px] overflow-y-auto px-4 py-6 bg-background text-foreground">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="flex flex-col gap-2 text-sm">
        {menuItems.map((item) => {
          const isOpen = selected === item.label;

          return (
            <div key={item.label}>
              <div
                onClick={() => {
                  setSelected(isOpen ? null : item.label);
                  setSelectedSub(null);
                  setSubOption(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors group",
                  isOpen
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.sub.length > 0 &&
                  (isOpen ? (
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  ))}

                {item.icon}
                <span className="flex-1">{item.label}</span>

                <span className="text-xs hidden sm:inline-flex gap-1 items-center">
                  {item.shortcut}
                </span>
              </div>

              {isOpen && item.sub.length > 0 && (
                <div className="ml-8 mt-1 flex flex-col gap-1 text-xs">
                  {item.sub.map((subItem) => (
                    <div
                      key={subItem}
                      onClick={() => {
                        setSelectedSub(subItem);
                        setSubOption(subItem);

                        const id = sectionMap[subItem];
                        if (id) scrollToSection(id);

                        setOpen(false); // Close drawer on click (for mobile)
                      }}
                      className={cn(
                        "cursor-pointer px-2 py-1 rounded-md transition-colors",
                        selectedSub === subItem
                          ? "bg-accent text-accent-foreground font-medium"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Separator className="my-6" />
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-2">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Menu className="w-4 h-4" /> Menu
            </Button>
          </DrawerTrigger>
          <DrawerContent side="left" className="max-w-[280px] p-0">
            {/* Hidden title for accessibility */}
            <DrawerTitle className="sr-only">Settings Menu</DrawerTitle>
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Static Sidebar on md+ */}
      <div className="hidden md:block h-full">
        <SidebarContent />
      </div>
    </>
  );
};

export default AppSideBar;
