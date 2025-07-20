import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

import Link from "next/link"
import AlbumCard from "../AlbumsComponent/AlbumCard"
import ImageCard from "../ImageCard"
import AlbumList from "./AlbumList"
import SharedButtons from "./SharedButtons"



async function ShareImages({ params }) {
   const res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image/share?id=${params.id}`) 
   const data = await res.json()
   return (
      data.data ?
         <Card x-chunk="dashboard-06-chunk-0" className="min-h-[90vh] relative">
            <SharedButtons params={params} albumComponent={<AlbumList />} />

            <CardHeader>
               <CardTitle>Your Saved Images</CardTitle>
               <CardDescription>
                  Paste your Copied Images Here Or Directly Add Images
               </CardDescription>
            </CardHeader>

            <CardContent>
               <div className="relative grid md:grid-cols-3 grid-cols-2 gap-4">
                  {params.type!=="album"?data.data.imageIds.map((item, i) => (
                     <ImageCard image={item} key={i} />
                  )) : 
                     <AlbumCard shared={true} item={data.data.albumId} />
              }
               </div>
            </CardContent>

         </Card>
         :<>
            <Dialog open={true}>
               <DialogContent>
                  <DialogTitle>Link Expired</DialogTitle>
                  <DialogDescription>This link is has expired or is not valid. Try generating a new link </DialogDescription>
                  <Link className="mx-auto underline text-blue-400" href="/">Home</Link>
               </DialogContent>

            </Dialog>
         </>
   )
}

export default ShareImages
