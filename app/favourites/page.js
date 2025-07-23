import { Suspense } from "react";
import NoImagesDoodle from "../_MyComponents/NoImagesDoodle";
import Wrapper from "../_MyComponents/Wrapper";
import FavouriteImage from "../_MyComponents/FavouriteComponent/FavouriteImage";
export const metadata = {
  title: "Favourites",
  description: "Your favourite images collected in one place. Relive your most loved memories on NextGallery.",
};

async function page({searchParams}) {
    const query = await searchParams
   return (
     <Suspense fallback={<h1>Loading...</h1>}>
       <Wrapper  params={query} card={<FavouriteImage param={query} />} />
     </Suspense>
   );
}

export default page
