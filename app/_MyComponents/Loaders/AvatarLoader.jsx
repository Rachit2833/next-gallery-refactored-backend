import { Skeleton } from "@/components/ui/skeleton"

function AvatarLoader() {
   return (
      <>
         {Array.from({ length: 2 }).map((_, i) => {
            return (
               <Skeleton key={i} className="flex flex-col w-28 h-28 rounded-full items-center">

                       <Skeleton className="text-center  mt-2" />
               </Skeleton>
            )
         })}
      </>
   )
}

export default AvatarLoader


