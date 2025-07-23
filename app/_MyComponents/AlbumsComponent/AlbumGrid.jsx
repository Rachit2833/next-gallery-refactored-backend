import { cookies } from "next/headers";
import AlbumCard from "./AlbumCard";
import NoImagesDoodle from "../NoImagesDoodle";

async function AlbumGrid({ year ,sort}) {
   const cookieStore = await cookies()
   const res = await fetch(`http://localhost:2833/album?year=${year || "all"}&sort=${sort}`, {

      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   const data = await res.json();

   return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-2">
         {data?.albums.length > 0 ? data?.albums.map((album, index) => (
            <AlbumCard item={album} key={index} />
         )) : <div className="col-span-full ">
            <NoImagesDoodle />
         </div>}
      </div>
   );
}

export default AlbumGrid;