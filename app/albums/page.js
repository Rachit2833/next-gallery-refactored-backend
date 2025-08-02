
import { Suspense } from "react";
import AlbumGrid from "../_MyComponents/AlbumsComponent/AlbumGrid";
import AlbumLoaders from "../_MyComponents/Loaders/AlbumLoaders";
import SideFilterLayout from "../_MyComponents/SideFilterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export const metadata = {
  title: "Albums",
  description: "Browse, organize, and manage your photo albums to relive your cherished moments on NextGallery.",
};

 async function page({searchParams}) {
  const query = await searchParams
  let year=query.year
  let sort=query.sort
   return (
     <>

         <SideFilterLayout formType="Album" text="Add Album" year={query?.year||"All"} />

       <Suspense key={[year, sort]} fallback={<AlbumLoaders />}>
         <Card x-chunk="dashboard-06-chunk-0"  className="w-full max-w-screen-2xl mx-auto overflow-hidden">
           <CardHeader>
                  <CardTitle>Your Saved Images</CardTitle>
                  <CardDescription>
                     Paste your Copied Images Here Or Directly Add Images
                  </CardDescription>
               </CardHeader>
               <CardContent>
         <AlbumGrid year={query.year} sort={query.sort||-1} />
         </CardContent>
       </Card>
       </Suspense>
     </>
   );
}

export default page
