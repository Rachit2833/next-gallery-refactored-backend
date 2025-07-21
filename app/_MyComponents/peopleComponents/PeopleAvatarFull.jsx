import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, } from "@radix-ui/react-avatar";
import Image from "next/image";
import image2 from "@/app/image3.jpeg";
import Link from "next/link";
import { cookies } from "next/headers";
import { CloudCog } from "lucide-react";
async function PeopleAvatarFull() {
    const abc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII="
   const cookieStore = await cookies()
   const response = await fetch("https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/labels", {
      next: { revalidate: 60 },
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   const people = await response.json();
   return (
      <>
         {people?.map((img, i) => {
            return <div key={i} className="flex flex-col items-center">
               <Link href={`/people/${img._id}`}>
                  <Avatar
                     key={i}

                     className="sm:h-24 border-2  sm:w-24 h-16 w-16 flex justify-center items-center"
                  >
                     <Image
                        src={img.ImageUrl||image2.src}
                        fill
                        alt={`Friend ${i + 1}`} 
                        placeholder={img.blurredImage||abc}
                        />

                     <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
               </Link>
               <span className="text-center mt-2">{img.label.split("_")[0] === "Person" ? "Unknown" : img.label}</span>
            </div>

         })}
      </>
   )
}

export default PeopleAvatarFull
