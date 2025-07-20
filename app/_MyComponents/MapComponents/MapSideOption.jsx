import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import CountryCard from "./CountryCard"
import { Countries } from "@/app/_lib/countries"
import Paris from "./paris.jpg"
import { cookies } from "next/headers"
function getCountryCodeByName(countryName) {
   const entries = Object.entries(Countries);
   const found = entries.find(([, name]) => name === countryName);
   return found ? found[0] : null; // Return the code or null if not found
}
async function MapSideOption({year,yearRange}) {
   const cookieStore = await cookies()
   const data = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/stats/countries?year=${year}&yearRange=${yearRange}`,{
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${cookieStore.get("session").value}`,
      },
   })
   const resData = await data.json()
   const favouriteCountry =  resData.favouriteCountry[0]._id 
   const favouriteLocation = resData.favouriteLocation[0]._id.locationName
   const favCode = getCountryCodeByName(favouriteCountry)
   return (
      <>
         <div className=" my-4 gap-4 grid h-[70vh] overflow-auto" >
            <Card>
               <CardHeader>
                  <CardTitle>{resData.AllCountries[0].countries.length} Countries Visited in Previous {yearRange === "All" ? "years" : yearRange === 1 ? `${year} year` : `${year} years`}  </CardTitle>
               </CardHeader>
               <CardContent>
                  <CountryCard data={resData.AllCountries} />
               </CardContent>
               <CardContent>

               </CardContent>
            </Card>
            <Card className=" ">
               <CardHeader>
                  <CardTitle>{resData.favouriteCountry[0].numImages} Photos Clicked In Previous 1 year </CardTitle>
                  <CardDescription>with {favouriteCountry} Being Your Favourite Country</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className=" grid grid-cols-1 h-32 gap-4">
                     <div className="flex relative items-center justify-center  ">
                        <Image src={`https://flagcdn.com/h240/${favCode}.png`} alt="India National Flag" fill />
                     </div>
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader>
                  <CardTitle> {favouriteLocation} </CardTitle>
                  <CardDescription>was your favourite Destination</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className=" grid grid-cols-1  gap-4">
                     <div className="flex items-end justify-end px-12 text-center relative h-40 ">
                        <Image src={Paris} fill alt="Paris, Eifel Tower" />
                        <h1 className="text-[1.5rem] absolute font-extrabold text-white">{favouriteLocation.split(",")[0]}</h1>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </>
   )
}

export default MapSideOption
