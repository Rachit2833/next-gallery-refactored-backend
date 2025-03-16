import Image from "next/image"
import imag from "./image7.jpg"
function GroupInfo() {
   return (
      <div>
         <Image className="h-12 w-12 rounded-full border-2 border-white p-1" alt="hsjd" src={imag} /> 
      </div>
   )
}

export default GroupInfo
