"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetOverlay, SheetTitle } from "@/components/ui/sheet";
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

  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(true);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSheetClose = () => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cod");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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

        <CardContent className="grid grid-cols-6 gap-4 relative">
          <Map>
            {LocationsCod.map((item, i) => (
              <Marker
                key={i}
                position={[item.coordinates[0], item.coordinates[1]]}
                draggable={false}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    setActiveMarker(item.name);
                    handleParams(item.name);
                  },
                }}
              >
                {activeMarker === item.name && <Popup>{item.name}</Popup>}
              </Marker>
            ))}
          </Map>

          <Card className="col-span-2">
            <CardContent className="m-4 p-0">
              <Filter
                setIsOpen={setIsOpen}
                paramName="yearRange"
                year={yearRange}
                values={filterArray}
                defaultValue="All"
              />
              <Suspense key={[yearRange, paramLoc]} fallback={<MapSideOptionLoader />}>
                {sideField}
              </Suspense>
            </CardContent>
          </Card>

          <Sheet
            open={isOpen}
            onOpenChange={(open) => {
              if (!open) handleSheetClose();
              else setIsOpen(true);
            }}
            className="absolute top-0 right-0 z-50 h-full"
          >
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
        </CardContent>
      </Card>
    </div>
  );
}

export default MapView;
