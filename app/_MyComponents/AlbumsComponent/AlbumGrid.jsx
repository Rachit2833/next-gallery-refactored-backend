import { cookies } from "next/headers";
import AlbumCard from "./AlbumCard";

async function AlbumGrid({year}) {
   const cookieStore = await cookies()
   const res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/album?year=${year||"all"}`,{
      next: { revalidate: 60 },
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   const data = await res.json();

   return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-2">
         {data?.albums.map((album, index) => (
            <AlbumCard item={album}  key={index} />
         ))}
      </div>
   );
}

export default AlbumGrid;