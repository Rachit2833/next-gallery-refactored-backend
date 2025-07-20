import ImageCard from "../ImageCard"
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
function ImageAlbumAddLayout() {
   // const url = `https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image${queryString ? `?${queryString}` : ""}`
   // let res = await fetch(url);
   // res = await res.json();
   const res =[1,2,3]
   return (
      <div className=" w-[90%] mx-auto ">
         <DrawerHeader >
            <DrawerTitle className="text-center">Select Images from your Local Storage</DrawerTitle>
            <DrawerDescription className="text-center">Description and Location can be Editable from the Input Fields Below</DrawerDescription>
         </DrawerHeader>
         <DrawerFooter className="grid grid-cols-3">
        
     {res.map((item,index)=>{
        return <ImageCard  key={index} image={item} />
     })}
   </DrawerFooter >
   </div >
   )
}

export default ImageAlbumAddLayout
