'use client'
import { useUser } from "../_lib/context"
import ImageCard from "./ImageCard"

function SearchGrid() {
   const {searchData,}=useUser()
   return (
      searchData?.LocationData[0]?.data.map((item, index) => (
         <ImageCard key={index} image={item} />
      ))
   )
}

export default SearchGrid
