import { Skeleton } from "@/components/ui/skeleton"

function AlbumLoaders() {
   return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-2">
        {Array.from({length:6}).map((_,i)=>{
           return (
              <Skeleton key={i} className="relative min-h-[20rem] rounded-xl border-4 w-full  sm:min-h-[24rem] lg:min-h-[30rem]">
                 <div className="absolute  w-4/5    z-10 top-6 sm:top-12 left-4 sm:left-8">
                    <Skeleton className=" w-full p-8" />
                    <Skeleton className=" w-full p-6 mt-2" />
                    <Skeleton className=" w-3/4 p-2 mt-2" />

                 </div>



                 <div className="absolute flex flex-row items-center justify-center gap-4 z-10 bottom-6 sm:bottom-12 right-4 sm:right-8">
                    <Skeleton className="p-2 w-12 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors" />
                    <Skeleton className="flex w-12 items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors" />
                    <Skeleton className="flex w-24 items-center p-2 sm:p-4 bg-transparent border-2 border-white text-white text-[0.9rem] sm:text-[1rem] hover:bg-white hover:text-black transition-colors" />
                 </div>
              </Skeleton>
           )
        })}
      </div>
   )
}

export default AlbumLoaders
