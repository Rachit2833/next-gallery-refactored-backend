import { cookies } from "next/headers";
import AlbumCardList from "./AlbumCardList";


async function AlbumList() {
   console.log(1);
      const cookieStore = cookies()
      const res = await fetch(`http://localhost:2833/album?year=all`,{
         headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${cookieStore.get("session").value}`,
         },
      });
   console.log(2);
   const data = await res.json();
   console.log(data);
   return (
         data?.albums.map((album, index) => (
           <>
               <AlbumCardList album={album} key={index} /> 

               
           </>
         ))
   )
}

export default AlbumList
