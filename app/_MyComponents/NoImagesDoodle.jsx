import il from "@/app/il1.png"
import Image from "next/image"
function NoImagesDoodle() {
   return (
      <div className="relative flex flex-col items-center">
         <Image className="mx-auto" height={400} width={400} alt="A family Album" src={il} />
         <h3 className="doodle text-[3rem] bottom-12 text-purple-600 right-1/2 translate-x-[50%] absolute">
            Ohh! No Images here
         </h3>
         <h2 className=" text-[1.25rem] heading">Use Add Images to add Images</h2>
      </div>
   )
}

export default NoImagesDoodle
