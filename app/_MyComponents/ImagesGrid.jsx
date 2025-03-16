import { cookies } from "next/headers";
import PasteCards from "./AlbumsComponent/PasteCards";
import NoImagesDoodle from "./NoImagesDoodle";

async function ImagesGrid({ year, cod, frId,query }) {
   const params = new URLSearchParams();
   const cookieStore= await cookies()
   if (year) params.append("year", year);
   if (cod) params.append("cod", cod);
   if (frId) params.append("frId", frId);
   const queryString = params.toString(); // Convert to query string
   console.log(cookieStore.get("session").value);
   const url = `http://localhost:2833/image${queryString ? `?${queryString}` : ""}`
   let res = await fetch(url,{
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   res = await res.json();

   return res?.images.length !== 0 ? <PasteCards query={query} res={res.images} cod={cod} frId={frId} /> : <NoImagesDoodle /> ;
}

export default ImagesGrid;