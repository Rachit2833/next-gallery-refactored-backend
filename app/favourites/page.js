import { Suspense } from "react";
import NoImagesDoodle from "../_MyComponents/NoImagesDoodle";
import Wrapper from "../_MyComponents/Wrapper";
import FavouriteImage from "../_MyComponents/FavouriteComponent/FavouriteImage";
export const revalidate = 0;
async function page({searchParams}) {
    const query = await searchParams
   return (
     <Suspense fallback={<h1>Loading...</h1>}>
       <Wrapper searchYear={query.year} card={<FavouriteImage />} />
     </Suspense>
   );
}

export default page
