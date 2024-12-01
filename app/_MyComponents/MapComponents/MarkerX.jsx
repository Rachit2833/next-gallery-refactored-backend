import { Marker, Popup } from "react-leaflet";
import image from "./icons.png";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
function MarkerX({Location,setLocation,setIsOpen}) {
   const searchParams = useSearchParams()
   const pathname = usePathname()
   const router = useRouter()
   function handleParams(position) {
      if (!searchParams) return; // Ensure searchParams are loaded
      const params = new URLSearchParams(searchParams);
      params.set("cod", position);
      router.push(`/memory-map?cod=${position}`, { scroll: false });
   }
   const customIcon = new L.Icon({
      iconUrl: image.src,
      iconSize: [35, 45],
      iconAnchor: [17, 45],
      popupAnchor: [0, -45],
   });
   return (
      Location.data[0].Location.map((item, i) => (
            <Marker
               key={i}
               position={[item.coordinates[0], item.coordinates[1]]}
               draggable={false}
               animate={true}
               icon={customIcon}
               eventHandlers={{
                  click: () => {
                     handleParams(item.name);
                     setLocation(item.name);
                     setIsOpen(true)
                  },
               }}
            >
               <Popup>{item.name}</Popup>
            </Marker>
         ))
   )
}

export default MarkerX
