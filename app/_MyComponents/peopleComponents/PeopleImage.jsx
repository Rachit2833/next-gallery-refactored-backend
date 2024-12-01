import ImageCard from "../ImageCard";
async function PeopleImage({ name }) {
   const data = await fetch(`http://localhost:2833/image?friendId=${name}`)
   const res =  await data.json()
   console.log(res,"fss");

   return (
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4 md:gap-0">


         {
            res.images.map((item, index) => (
               <ImageCard key={index} image={item} />
            ))
         }

      </div>
   )
}

export default PeopleImage
