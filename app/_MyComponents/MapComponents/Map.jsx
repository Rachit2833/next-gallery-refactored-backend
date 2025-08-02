"use client"
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";


function Map({ children}) {
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
