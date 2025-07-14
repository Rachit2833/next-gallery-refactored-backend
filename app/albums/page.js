
import { Suspense } from "react";
import AlbumGrid from "../_MyComponents/AlbumsComponent/AlbumGrid";
import AlbumLoaders from "../_MyComponents/Loaders/AlbumLoaders";
import SideFilterLayout from "../_MyComponents/SideFilterLayout";
export const revalidate = 0;
 async function page({searchParams}) {
  const query = await searchParams
   return (
     <>
       <div className="flex items-center">
         <SideFilterLayout formType="Album" text="Add Album" year={query.year} />
       </div>
       <Suspense fallback={<AlbumLoaders />}>
         <AlbumGrid year={query.year} />
       </Suspense>
     </>
   );
}

export default page
