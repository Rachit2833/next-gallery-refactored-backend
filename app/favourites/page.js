import { Suspense } from "react";
import Wrapper from "../_MyComponents/Wrapper"

function page() {
   return (
     <Suspense fallback={<h1>Loading...</h1>}>
       <Wrapper />
     </Suspense>
   );
}

export default page
