import { CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function MapSideOptionLoader() {
   return (
      <div className=" grid gap-4 my-4 h-[70vh] overflow-auto">
         <Skeleton>
            <CardHeader>
               <Skeleton className="w-3/4 h-4" />  
            </CardHeader>
            <CardContent>
               <div  className={` grid grid-cols-8 h-36 overflow-auto px-1 py-4`}>
                  {Array.from({length:16}).map((name, i) => {
                     return (
                           <Skeleton key={i} className="flex relative items-center justify-center h-12 overflow-auto w-10 gap-4  ">
                              <Skeleton  />
                           </Skeleton>
                     )
                  })}
               </div>
            </CardContent>
            <CardContent>
            </CardContent>
         </Skeleton>
         <Skeleton>
            <CardHeader>
               <Skeleton className="w-3/4 h-4" /> 
               <Skeleton className="w-full h-4" /> 
            </CardHeader>
            <CardContent>
               <Skeleton className=" grid grid-cols-1 h-32 gap-4">
                  <div className="flex relative items-center justify-center h-36 ">
                  </div>
               </Skeleton>
            </CardContent>
         </Skeleton>
         <Skeleton>
            <CardHeader>
               <Skeleton className="w-3/4 h-4" />
               <Skeleton className="w-full h-4" />
            </CardHeader>
            <CardContent>
               <Skeleton className=" grid grid-cols-1  gap-4">
                  <div className="flex items-end justify-end px-12 text-center relative h-40 ">
                     
                     <h1 className="text-[1.5rem] absolute font-extrabold text-white"></h1>
                  </div>
               </Skeleton>
            </CardContent>
         </Skeleton>
      </div>
   )
}

export default MapSideOptionLoader
