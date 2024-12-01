import AlbumCard from "./AlbumCard";

async function AlbumGrid({year}) {
   const res = await fetch(`http://localhost:2833/album?year=${year||"all"}`);
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