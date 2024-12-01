import ImageCard from "../ImageCard"

async function MapSideImages({search}) {
    let res = await fetch(`http://localhost:2833/image/loc?cod=${search}`)
     let data = await res.json()


   return (
      <div className="grid grid-cols-2 gap-4">
        {data.images.map((image,i)=>{
         return (
             <ImageCard key={i} />
             )})}
      </div>
   )
}

export default MapSideImages
