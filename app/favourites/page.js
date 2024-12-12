import { Suspense } from "react";
import Wrapper from "../_MyComponents/Wrapper"
import NoImagesDoodle from "../_MyComponents/NoImagesDoodle";

async function page({searchParams}) {
    const query = await searchParams
   return (
     <Suspense fallback={<h1>Loading...</h1>}>
       <Wrapper searchYear={query.year} card={<NoImagesDoodle />} />
     </Suspense>
   );
}

export default page
