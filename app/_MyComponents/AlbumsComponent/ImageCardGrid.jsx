import PasteCards from "./PasteCards";
import { cookies } from "next/headers";
import NoImagesDoodle from "../NoImagesDoodle";
async function ImageCardGrid({ id, year }) {
   const cookieStore = await cookies()
   const yearParam = year === "All" ? "all" : year;
   let res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/album/images/${id}?year=${yearParam}`, {

      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   });
   res = await res.json()
   return (
      <>
         {res?.data?.Images.length !== 0 ? <PasteCards res={res?.data?.Images} /> : <NoImagesDoodle />}
      </>
   )
}

export default ImageCardGrid
