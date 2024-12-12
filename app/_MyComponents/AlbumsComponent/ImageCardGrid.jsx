import Image from "next/image";
import PasteCards from "./PasteCards";

import { Button } from "@/components/ui/button";
import NoImagesDoodle from "../NoImagesDoodle";
async function ImageCardGrid({id,year}) {
      let res = await fetch(`http://localhost:2833/album/images/${id}?year=${year||"all"}`);
      res = await res.json()
   console.log(res?.data?.Images.length,"sfsf");
   return (
      <>
         {res?.data?.Images.length !== 0 ? <PasteCards res={res?.data?.Images} /> :<NoImagesDoodle /> }
      </>
   )
}

export default ImageCardGrid
