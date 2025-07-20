import { cookies } from "next/headers";
import AlbumCardList from "./AlbumCardList";


async function AlbumList() {

      const cookieStore = await cookies()
      const res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/album?year=all`,{
         next: { revalidate: 60 },
         headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookieStore.get("session").value}`,
         },
      });
   const data = await res.json();
   return (
         data?.albums.map((album, index) => (
           <>
               <AlbumCardList album={album} key={index} /> 

               
           </>
         ))
   )
}

export default AlbumList
