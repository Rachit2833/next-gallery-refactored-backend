'use client'
import { useUser } from "@/app/_lib/context"
import IconButtons from "./IconButtons"

function SharedButtons({ albumComponent,params }) {
    console.log(albumComponent,"12343423");
   const {selectedImages} = useUser()
    return (
        <>
       
            {selectedImages.length > 0 ? <IconButtons params={params} save={true} albumComponent={albumComponent} /> : null}
        </>
   )
}

export default SharedButtons
