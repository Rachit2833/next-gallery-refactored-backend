"use client";
import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChevronDownCircle, ChevronUpCircle, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LabelSelector({ children, item }) {
   const { isOpen, setIsOpen, isSelected } = useUser();
   const isSelectedItem = isSelected?.autoSend?.descriptorId === item._id;
   console.log(isSelectedItem,"isSelectedItem")
   const isExpanded = isOpen === item._id;
   console.log(item,"label");
   return (
      <>
         <div
            className={`flex mb-2 p-3 gap-2 w-full h-16 items-center justify-between rounded-lg transition-all duration-300 
        ${isSelectedItem
                  ? "border-2 border-[#007bff] bg-[#007bff]/10 shadow-md"
                  : "hover:bg-gray-200 hover:shadow"
               }`}
         >
            <div className="flex items-center gap-3">
               <Avatar
                  className={`h-12 w-12 object-cover transition-all duration-300 ${isSelectedItem
                        ? "ring-4 ring-[#007bff] shadow-lg"
                        : "hover:ring-2 hover:ring-gray-400"
                     }`}
               >
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
               <div className="flex flex-col justify-center h-full">
                  <h1
                     className={`text-lg font-semibold cursor-pointer transition-colors flex items-center gap-2 ${isSelectedItem ? "text-[#007bff] brightness-125" : "text-gray-800 hover:text-[#007bff]"
                        }`}
                  >
                     {item.label}
                     {isSelectedItem && <CheckCircle className="text-[#007bff] w-5 h-5" />}
                  </h1>
               </div>
            </div>
            <button
               onClick={() => setIsOpen(isExpanded ? null : item._id)}
               className="p-2 rounded-full transition-all duration-300 hover:bg-gray-300 hover:scale-105"
            >
               {isExpanded ? (
                  <ChevronUpCircle className="text-[#007bff]" />
               ) : (
                  <ChevronDownCircle className="text-gray-500 hover:text-[#007bff]" />
               )}
            </button>
         </div>
         {isExpanded && <div className="p-3">{children}</div>}
         <Separator />
      </>
   );
}

export default LabelSelector;
