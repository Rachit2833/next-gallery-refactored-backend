"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import Filter from "../Filter";
import MapSideImageLoader from "../Loaders/MapSideImageLoader";
import MapSideOptionLoader from "../Loaders/MapSideOptionLoader";
import Map from "./Map";
import image from "./icons.png";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: image.src,
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -45],
});

function MapView({ imageCard, Location, sideField, param }) {
  const yearRange = param.yearRange;
  const paramLoc = param.cod;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showSheet, setShowSheet] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const filterArray = [
    { label: "All", value: "All" },
    { label: "1 yrs", value: 1 },
    { label: "3 yrs", value: 3 },
    { label: "5 yrs", value: 5 },
  ];

  const LocationsCod = useMemo(() => Location.data[0].Location, [Location]);

  const handleParams = (filterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cod", filterValue);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    if (window.innerWidth >= 1280) {
      setShowSheet(true);
    } else {
      setShowDrawer(true);
    }
    setActiveMarker(filterValue);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cod");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setShowDrawer(false);
    setShowSheet(false);
  };

  return (
    <div className="flex flex-col space-y-4 h-[70vh] relative">
      <Card>
        <CardHeader>
          <CardTitle>Access All of your Memories in the Map</CardTitle>
          <CardDescription>
            Note: Memories with invalid or imaginary location won't appear on Memory-Map
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 xl:grid-cols-6 gap-4 relative">
          {/* Map (always full width on mobile, spans 4 cols on xl) */}
          <div className="col-span-1 xl:col-span-4">
            <Map>
              {LocationsCod.map((item, i) => (
                <Marker
                  key={i}
                  position={[item.coordinates[0], item.coordinates[1]]}
                  draggable={false}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleParams(item.name),
                  }}
                >
                  {activeMarker === item.name && <Popup>{item.name}</Popup>}
                </Marker>
              ))}
            </Map>
          </div>

          {/* Summary Panel — only visible on xl+ */}
          <div className="hidden xl:block col-span-2">
            <Card className="h-full">
              <CardContent className="m-4 p-0 space-y-4">
              <div className=" sm:flex  items-center">
                <Filter
                  setIsOpen={() => {}}
                  paramName="yearRange"
                  year={yearRange}
                  values={filterArray}
                  defaultValue="All"
                />
                </div>
                <Suspense key={[yearRange, paramLoc]} fallback={<MapSideOptionLoader />}>
                  {sideField}
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Trigger for Summary Drawer (mobile only) */}
      <div className="fixed bottom-4 right-4 xl:hidden z-50">
        <Drawer open={showSummaryDrawer} onOpenChange={setShowSummaryDrawer}>
          <DrawerTrigger asChild>
            <Button variant="outline">View Summary</Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Your Year in Review</DrawerTitle>
              <DrawerDescription>Overview of your activity</DrawerDescription>
            </DrawerHeader>
            <Suspense fallback={<MapSideOptionLoader />}>
              {sideField}
            </Suspense>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Sheet on marker click (xl only) */}
      <Sheet open={showSheet} onOpenChange={(open) => (open ? setShowSheet(true) : handleClose())}>
        <SheetOverlay className="bg-white/10" />
        <SheetContent side="right" className="sm:max-w-[50rem] overflow-auto">
          <SheetHeader className="w-full">
            <SheetTitle>Memories From This Location</SheetTitle>
            <SheetDescription>{paramLoc}</SheetDescription>
          </SheetHeader>
          <Suspense key={[paramLoc, activeMarker]} fallback={<MapSideImageLoader />}>
            {imageCard}
          </Suspense>
        </SheetContent>
      </Sheet>

      {/* Drawer on marker click (below xl) */}
      <Drawer open={showDrawer} onOpenChange={(open) => (open ? setShowDrawer(true) : handleClose())}>
        <DrawerContent className="h-[85vh] overflow-y-auto xl:hidden">
          <DrawerHeader>
            <DrawerTitle>{paramLoc}</DrawerTitle>
            <DrawerDescription>Memories from this place</DrawerDescription>
          </DrawerHeader>
          <Suspense key={[paramLoc, activeMarker]} fallback={<MapSideImageLoader />}>
            {imageCard}
          </Suspense>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default MapView;
