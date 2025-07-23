"use client"
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { Children, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

function Map({ children}) {

   const searchParams = useSearchParams();
   const pathname = usePathname();
   const router = useRouter();

   
   

   return (
      <MapContainer
         center={[30, 30]}
         zoom={2}
         className="relative col-span-4 h-[80vh] z-0"
      >
         <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
         />
          {children}
      </MapContainer>
   );
}

export default Map;
