import Image from "next/image";
import Img from "./image7.jpg";
import { useUser } from "@/app/_lib/context";
import image from "./image7.jpg"
import image2 from "./a.avif"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { addGroup } from "@/app/_lib/actions";
import { SubmitButton } from "../SignUpForm";

function From2() {
   const { selectedInGroup, setSelectedInGroup } = useUser();
   const [imageSelected, setImageSelected] = useState(null);
   const userId = localStorage.getItem("userId")
   useEffect(()=>{
     if(!selectedInGroup.includes(userId))
      { 
         setSelectedInGroup([...selectedInGroup,userId])
      }
   },[])
   return (
      <form action={async(formData) => {
         await addGroup(formData, selectedInGroup, userId)
         setSelectedInGroup([])
         setImageSelected(null)
      }}>
         <div className="flex flex-col gap-6 p-4 rounded-lg ">
         {/* Group Header */}
         <div className="flex items-center gap-4 p-4 bg-gray-200 rounded-md">
            <Image width={64} height={64} className="h-16 w-16 rounded-full object-cover  border-white border-4" alt="Group Icon" src={imageSelected||Img} />
            <input
               name="name"
               type="text"
               placeholder="Group Name"
               className="w-full px-3 py-2 border-b-2 border-gray-400 focus:border-blue-500 outline-none bg-transparent"
            />
         </div>

         {/* Additional Input */}
         <input
            name="description"
            type="text"
            placeholder="Group Description"
            className="w-full px-3 py-2 border-b-2 border-gray-400 focus:border-blue-500 outline-none bg-transparent"
         />
         <div className="w-full">
            <label className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200">
               Upload File
                  <input accept="image/*" type="file" name="photo" className="hidden" onChange={(e)=>setImageSelected(URL.createObjectURL(e.target.files[0]))} />
            </label>
            {imageSelected && (
               <p className="mt-2 text-sm text-gray-700 text-center">{imageSelected.name}</p>
            )}
         </div>

         <h1>People Selected</h1>
            <div className="flex px-3">
            <Image  className=" -mx-3 border-2 border-white rounded-full w-12 h-12"  alt="People" src={image2} />
               {selectedInGroup.map((id, i) => {
                  console.log(id, "id", id === localStorage.getItem('userId'));
                  return id !== localStorage.getItem('userId') ? (
                     <Image key={i} className=" -mx-3 border-2 border-white rounded-full w-12 h-12" alt="People" src={image} />
                  ) : null;
               })}
            </div>
         </div>
         
         <SubmitButton className="w-full" buttonText="Submit" />
      </form>
   );
}

export default From2;
