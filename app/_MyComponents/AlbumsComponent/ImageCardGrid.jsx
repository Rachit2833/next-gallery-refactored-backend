import PasteCards from "./PasteCards";
async function ImageCardGrid({id,year}) {
      let res = await fetch(`http://localhost:2833/album/images/${id}?year=${year||"all"}`);
      res = await res.json()
      console.log(res);
   return (
      <>
         <PasteCards res={res?.data?.Images} />
      </>
   )
}

export default ImageCardGrid
