"use client"

import { Form, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Uploadcard from "./UploadCard"

// Define the form schema using zod
const formSchema = z.object({
   username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
   }),
})

function FileForm({input="true",urlBlob}) {
   const [file ,setFile]=useState()
   const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
         username: "",
      },
   })

   // Handle form submission
   function onSubmit(values) {
      console.log(values)
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
         
               <Uploadcard img={file || urlBlob} />

            {input?<FormField
               control={form.control}
               name="Description"
               render={({ field }) => (
                  <div className="grid w-full  items-center gap-1.5">
                     <FormLabel>Image/Files</FormLabel>
                     <Input
                        onChange={(e) => {
                           if (e.target.files[0]) {
                              setFile(URL.createObjectURL(e.target.files[0])) // Create a preview URL for the uploaded image

                           }
                        }} 
                        className=" border border-input bg-transparent h-9  flex w-full rounded-md file:h-9   file:bg-primary file:text-white file:text-sm file:font-medium"
                        type="file"
                        id="picture"
                     />
                  </div>
               )}
            />:null}
            
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
      </Form>
   )
}

export default FileForm