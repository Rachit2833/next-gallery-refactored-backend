
import { Suspense } from "react";
import AlbumGrid from "../_MyComponents/AlbumsComponent/AlbumGrid";
import AlbumLoaders from "../_MyComponents/Loaders/AlbumLoaders";
import SideFilterLayout from "../_MyComponents/SideFilterLayout";
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
       <div className="flex items-center">
         <SideFilterLayout formType="Album" text="Add Album" year={query?.year||"All"} />
       </div>
       <Suspense key={[year, sort]} fallback={<AlbumLoaders />}>
         <AlbumGrid year={query.year} sort={query.sort||-1} />
       </Suspense>
     </>
   );
}

export default page
