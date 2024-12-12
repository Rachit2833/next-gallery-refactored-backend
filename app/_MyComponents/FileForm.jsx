"use client"

import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { z } from "zod"
import Uploadcard from "./UploadCard"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { Deletebutton } from "./ImageCard"
import { saveNewImage } from "../_lib/actions"
function FileForm({input="true",urlBlob}) {
   const [file ,setFile]=useState()


   return (

         <form  action={saveNewImage} className="space-y-8">
         
               <Uploadcard img={file || urlBlob} />

            {input?
                  <div className="grid w-full  items-center gap-1.5">
                     
                     <Input
                       name="photo"
                        onChange={(e) => {
                           if (e.target.files[0]) {
                              setFile(URL.createObjectURL(e.target.files[0])) // Create a preview URL for the uploaded image
                           }
                        }} 
                        className=" border border-input bg-transparent h-9  flex w-full rounded-md file:h-9   file:bg-primary file:text-white file:text-sm file:font-medium"
                        type="file"
                        id="picture"
                     />
               <Deletebutton text={"Submit"} />

               <DrawerClose className=" border-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-white text-black shadow  " >  Cancel </DrawerClose>
                  </div>
              :null}
         
            
            {/* <FormField
               control={form.control}
               name="Location"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Description</FormLabel>
                     <FormControl>
                        <Input placeholder="Corner Of Universe" {...field} />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               )}
            /> */}
            {/* Submit button */}
            {/* <Button type="submit">Submit</Button> */}
         </form>

   )
}

export default FileForm