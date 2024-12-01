"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Suspense } from "react";
import PasteCards from "./AlbumsComponent/PasteCards";
import ImageCardGrid from "./AlbumsComponent/ImageCardGrid";
import ImageLoader from "./Loaders/ImageLoader";


function MainSlide({ searchYear,card}) {

   return (
<>

            <Card x-chunk="dashboard-06-chunk-0">
               <CardHeader>
                  <CardTitle>Your Saved Images</CardTitle>
                  <CardDescription>
                     Paste your Copied Images Here Or Directly Add Images
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Suspense fallback={<ImageLoader />}>

                  {card}
                  </Suspense>
                   
               </CardContent>
               <CardFooter>
                  <div className="text-xs text-muted-foreground">
                     Showing <strong>20</strong> of <strong>20</strong> photos
                  </div>
               </CardFooter>
            </Card>
      </>  

   )
}

export default MainSlide;