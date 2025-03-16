
import { Input } from "@/components/ui/input";
import { Earthbutton } from "./UploadCard"

function CoordinatesForm({setLocation,setLocationData,setIsPending,handleLocationBlur,isPending,setLat,setLong}) {
   function getCoordinates(e) {
         e.preventDefault();
         setIsPending(true);
         new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
         })
            .then(async (position) => {
               setLat(position.coords.latitude);
               setLong(position.coords.longitude);
   
               const formData = new FormData();
               formData.append("location", location);
               formData.append("latitude", position.coords.latitude);
               formData.append("longitude", position.coords.longitude);
               formData.append("description", description);
   
               const res = await getLocationInfo(formData);
               setLocation(`${res.city}, ${res.country}`);
               setLocationData({
                  Country: res.country,
                  principalSubdivision: res.principalSubdivision,
               });
            })
            .catch((error) => {
               console.error(error);
            })
            .finally(() => {
               setIsPending(false);
            });
      }
   return (
       <form className="grid grid-cols-6 gap-4" onSubmit={getCoordinates}>
                        <Input
                           className="col-span-5 h-6 border-none my-2"
                           name="LocationName"
                           onChange={handleLocationBlur}
                           value={location}
                        />
                        {!isPending ? <Earthbutton /> : <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      }
                     </form>
   )
}

export default CoordinatesForm
