"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import ImageLoader from "./Loaders/ImageLoader";
import { Heart } from "lucide-react";
import IconButtons from "./SearchComponents/IconButtons";
import { useUser } from "../_lib/context";



function MainSlide({ val, albumComponent,searchYear,card,page}) {
const {selectedImages,  } = useUser();
   return (
<>

            <Card x-chunk="dashboard-06-chunk-0" className="min-h-[85vh] relative">
             {selectedImages.length>0?<IconButtons val={val} albumComponent={albumComponent} />:null}

               <CardHeader>
                  <CardTitle>Your Saved Images</CardTitle>
                  <CardDescription>
                     Paste your Copied Images Here Or Directly Add Images
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Suspense key={[searchYear,page]} fallback={<ImageLoader />}>

                  {card}
                  </Suspense>
                   
               </CardContent>
            </Card>
      </>  

   )
}

export default MainSlide;