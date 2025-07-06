"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { changeLabel } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { SubmitButton } from "./LeaveDialog";

function LabelImages({ val}) {
   const { isOpen, setIsOpen } = useUser()
   const [images, setImages] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const { isSelected, setIsSelected, setIsInfoOpen,  }=useUser()
   
   const imageUrls = [
      "https://images.unsplash.com/photo-1731331443866-8f6f72027157?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1725442224908-e2c81b767898?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1676478747004-ccdc59253b62?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1741207171370-3cee390e85da?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740021790984-c34b2b20b4a6?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740021790984-c34b2b20b4a6?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740021790984-c34b2b20b4a6?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740543860663-3e792b7aea1a?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740021790984-c34b2b20b4a6?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740543860663-3e792b7aea1a?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1739392084063-1e13fc4da50f?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740021790984-c34b2b20b4a6?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740421198589-f98aa30526ac?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1740543860663-3e792b7aea1a?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1730466782483-98c27d88efca?w=900&auto=format&fit=crop&q=60",
   ];


   const url = `http://localhost:2833/image?frId=${isOpen}`;


   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);

            const res = await fetch(url, {
               headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${val}`,
               },
            });

            if (!res.ok) throw new Error("Failed to fetch images");

            const data = await res.json();
            setImages(data.images.slice(0, 14));
         } catch (err) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [url]);

   if (loading) return <div className="text-center py-4">Loading images...</div>;
   if (error) return <div className="text-center text-red-500">{error}</div>;

   return (
      <div className="p-2 w-full">
         <div className="columns-2 my-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2">
            {images.map((item, i) => (
               <div key={i} className="mb-2 break-inside-avoid rounded-lg shadow-md">
                  <Image
                     width={300}
                     height={400}
                     className="w-full h-auto rounded-lg object-cover"
                     src={imageUrls[0]}
                     alt={`Image ${i}`}
                  />
               </div>
            ))}
         </div>
         <form action={async()=>{ 

            await changeLabel(isSelected.rId, isOpen, isSelected.idBit,isSelected.autoSend.enabled?1:2)
            setIsInfoOpen(false)
            setIsSelected(null)  
            setIsOpen(null)
            
         }}  className="flex justify-end">
            <SubmitButton buttonText="Select" />
         </form>
      </div>
   );
}

export default LabelImages;
