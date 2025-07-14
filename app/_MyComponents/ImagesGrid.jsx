import { cookies } from "next/headers";
import PasteCards from "./AlbumsComponent/PasteCards";
import NoImagesDoodle from "./NoImagesDoodle";
import { PagePagination } from "./Pagination";
import ImageWrapper from "./ImageWrapper";

async function ImagesGrid({ val, year, cod, frId, query,page,limit }) {
   const id = val.valid ? val.user.id : null;
   const params = new URLSearchParams();
   const cookieStore = await cookies();
 
   if (year) params.append("year", year);
   if (cod)  params.append("cod", cod);
   if (frId) params.append("frId", frId);
   if (page) params.append("page",page)
   if (limit) params.append("limit",limit)
   const queryString = params.toString();
   const url = `http://localhost:2833/image${queryString ? `?${queryString}` : ""}`;

   let res = await fetch(url, {
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   
   res = await res.json();


   // res.images = await Promise.all(
   //    res.images.map(async (img,i) => {
   //       img.blurredImage = await getImageBlurred(img?.ImageUrl === "https://example.com/image1.jpg" ?"https://images.unsplash.com/photo-1556742517-fde6c2abbe11?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8c3F1YXJlfGVufDB8fDB8fHww": img?.ImageUrl);
   //       return img;
   //    })
   // );
   return (
      <>
         {res?.images.length !== 0 ? (
            <>
               <ImageWrapper left={res?.leftPage} res={res?.images} cod={cod} />
               {/* <PasteCards query={query} res={res?.images} cod={cod} frId={frId} /> */}
            </>
         ) : (
            <NoImagesDoodle />
         )}
         <PagePagination totalPagesLeft={res.leftPage} />
      </>
    )
}

export default ImagesGrid;
