"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ImageLoader from "./Loaders/ImageLoader";
import { Heart } from "lucide-react";
import IconButtons from "./SearchComponents/IconButtons";
import { useUser } from "../_lib/context";



function MainSlide({ val, albumComponent,card, params}) {
const {selectedImages,  } = useUser();
const {page,year,frId,cod,query,sort}=params
   return (
<>

            <Card x-chunk="dashboard-06-chunk-0"  className="w-full max-w-screen-2xl mx-auto overflow-hidden">
             {selectedImages.length>0?<IconButtons val={val} albumComponent={albumComponent} />:null}

               <CardHeader>
                  <CardTitle>Your Saved Images</CardTitle>
                  <CardDescription>
                     Paste your Copied Images Here Or Directly Add Images
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Suspense key={[year,page,frId,cod,query,sort]} fallback={<ImageLoader />}>

                  {card}
                  </Suspense>
                   
               </CardContent>
            </Card>
      </>  

   )
}

export default MainSlide;