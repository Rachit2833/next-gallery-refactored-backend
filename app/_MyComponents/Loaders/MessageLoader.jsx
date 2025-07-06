import { Skeleton } from "@/components/ui/skeleton"

function MessageLoader() {
   return (
    <>
         <Skeleton className={`p-2 rounded-lg self-end h-28  w-1/2 break-words `}>
            <li > </li>
         </Skeleton>
         <Skeleton className={`p-2 rounded-lg self-end h-20  w-1/3 break-words `}>
            <li > </li>
         </Skeleton>
         <Skeleton className={`p-2 rounded-lg h-40  w-1/2 break-words `}>
            <li > </li>
         </Skeleton>
         <Skeleton className={`p-2 rounded-lg self-end h-12  w-20 break-words `}>
            <li > </li>
         </Skeleton>
         </>
   )
}

export default MessageLoader
