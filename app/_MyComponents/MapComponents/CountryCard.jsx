import Image from "next/image"
import { Countries } from "@/app/_lib/countries";
function getCountryCodeByName(countryName) {
   const entries = Object.entries(Countries);
   const found = entries.find(([, name]) => name === countryName);
   return found ? found[0] : null; // Return the code or null if not found
}
function CountryCard({data}) {


   return (
      <div className={` grid grid-cols-${data[0].countries.length > 8 ? 8 : data[0].countries.length > 6 ? 6 : data[0].countries.length >= 4? 4: 3} h-36 overflow-auto  gap-4`}>
         {data[0].countries.map((name,i)=>{
            const code =  getCountryCodeByName(name)
            return (
            <>
                  <div key={i} className="flex relative items-center justify-center min-h-8 overflow-auto ">
                     <Image src={`https://flagcdn.com/256x192/${code}.png`}
                        srcSet={`https://flagcdn.com/16x12/${code}.png 2x`} alt={` National Flag Of ${name}`} fill />
                  </div>
                  </>
            )
         })}
      </div>
   )
}

export default CountryCard
