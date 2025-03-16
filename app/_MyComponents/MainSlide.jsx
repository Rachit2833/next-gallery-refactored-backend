"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ImageLoader from "./Loaders/ImageLoader";


function MainSlide({ searchYear,card}) {

   return (
<>

            <Card x-chunk="dashboard-06-chunk-0" className="min-h-[85vh] relative">
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
            </Card>
      </>  

   )
}

export default MainSlide;