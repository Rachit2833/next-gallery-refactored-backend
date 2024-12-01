import { Suspense } from "react";
import Wrapper from "./_MyComponents/Wrapper";
import ImagesGrid from "./_MyComponents/ImagesGrid";



export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export default async function page({searchParams}) {
   let searchYear= await searchParams
    searchYear= searchYear.year
    console.log(searchYear);
    
  return (

      <Wrapper searchYear={searchYear} card={<ImagesGrid year={searchYear} />} />

  );
}
