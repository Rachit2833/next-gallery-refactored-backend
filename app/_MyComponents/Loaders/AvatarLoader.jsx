import { Skeleton } from "@/components/ui/skeleton"

function AvatarLoader() {
   return (
      <div className="p-4 grid grid-cols-5 gap-12 col-span-full">
         {Array.from({ length: 5 }).map((_, i) => {
            return (
               <Skeleton key={i} className="flex flex-col w-28 h-28 rounded-full items-center">

                       <Skeleton className="text-center  mt-2" />
               </Skeleton>
            )
         })}
      </div>
   )
}

export default AvatarLoader


