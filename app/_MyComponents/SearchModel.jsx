import {  ImageIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {  Alert,  AlertDescription,  AlertTitle,} from "@/components/ui/alert"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@radix-ui/react-scroll-area"
async function SearchModel() {
   const data = await fetch("https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image/search")
   let searchData=true
   return (
      <div className={`${searchData ? null : " hidden"} gap-2  h-[85%] my-2 grid grid-rows-auto`}>
         <Card className="p-2 ">
            <CardTitle className="my-2">People</CardTitle>
            <div className="flex gap-2">
               {Array.from({ length: 5 }).map((i, x) => {
                  return (
                     <Badge key={i} className="h-8">Rachit</Badge>
                  )
               })}
            </div>
         </Card>
         <Card className="p-2 ">
            <CardTitle className="my-2">Location</CardTitle>
            <div className="flex gap-2">
               {Array.from({ length: 5 }).map((i, x) => {
                  return (
                     <Badge key={i} className="h-8">Pauri</Badge>
                  )
               })}
            </div>
         </Card>
         <ScrollArea className=" border bg-card max-h-72 w-full  p-2 ">
            <Alert className="my-1 " >
               <ImageIcon className="h-4 w-4" />
               <AlertTitle>21 March, 2024</AlertTitle>
               <AlertDescription>
                  You can add components to your app using the cli.
               </AlertDescription>
            </Alert>
            <Separator />
            <Alert className="my-1" >
               <ImageIcon className="h-4 w-4" />
               <AlertTitle>21 March, 2024</AlertTitle>
               <AlertDescription>
                  You can add components to your app using the cli.
               </AlertDescription>
            </Alert>

         </ScrollArea>



      </div>
   )
}

export default SearchModel
