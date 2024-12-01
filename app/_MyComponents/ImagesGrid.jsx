import PasteCards from "./AlbumsComponent/PasteCards";

async function ImagesGrid( {year}) {

   let res = await fetch(`http://localhost:2833/image?year=${year||"all"}`);
   res = await res.json();
   console.log(res.images);
   return <PasteCards res={res.images} />;
}

export default ImagesGrid;