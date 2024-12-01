"use client"
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import image from "./icons.png";
import { useMemo, useState } from "react";

function Map({ isOpen, setIsOpen, Location,paramLoc }) {
   const [activeMarker,setActiveMarker]= useState(null)
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const router = useRouter()
   const LocationsCod = useMemo(() => Location.data[0].Location, [Location]);
   console.log(LocationsCod);
   function handleParams(filter) {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams);
      params.set("cod", filter);
      router.replace(`${pathname}?${params}`, { scroll: false });
   }
   const customIcon = new L.Icon({
      iconUrl: image.src,
      iconSize: [35, 45],
      iconAnchor: [17, 45],
      popupAnchor: [0, -45],
   });

   return (
      <MapContainer center={[30,30]} zoom={2} className="relative col-span-4  h-[80vh] z-0">
         <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
         {LocationsCod.map((item, i) => (
            <Marker
               key={i}
               position={[item.coordinates[0], item.coordinates[1]]}
               draggable={false}
               animate={true}
               icon={customIcon}
               eventHandlers={{
                  click: () => {
                        handleParams(item.name); // Update the URL after a delay
                        setActiveMarker(item.name)
                        setIsOpen(true);
                  },
               }}
            >
               {activeMarker===item.name?<Popup>{item.name}</Popup>:null}
            </Marker>
         ))}
        
      </MapContainer>
   )
}

export default Map
