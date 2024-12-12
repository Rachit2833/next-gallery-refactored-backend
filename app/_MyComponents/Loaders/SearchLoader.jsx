import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Badge, ImageIcon } from "lucide-react";

function SearchLoader() {
   return (
      <div>
         <div className="gap-2 h-[85%] my-2 grid auto-rows-auto">
            <Skeleton className="p-2">
               <Skeleton className="my-2 h-4 w-1/3" />
               <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                     return <Skeleton className="w-12 h-4" key={i} />
                  })}
               </div>
            </Skeleton>
            <Skeleton className="p-2">
               <Skeleton className="my-2 h-4 w-1/3" />
               <div className="flex gap-2">
                   {Array.from({ length: 5 }).map((_, i) => {
                     return <Skeleton className="w-12 h-4" key={i} />
                  })}
               </div>
            </Skeleton>
            <ScrollArea className="border bg-card max-h-72 w-full p-2">
               {Array.from({length:5}).map((item, i) => (
                  <div key={i}>
                     <Alert className="my-1">
                        <ImageIcon className="h-4 w-4" />
                        <Skeleton className="mx-10 h-4 w-1/3" />
                        <Skeleton className=" ml-10 h-4 w-full" />
                       
                     </Alert>
                     <Separator />
                  </div>
               ))}
            </ScrollArea>
         </div>
      </div>
   );
}

export default SearchLoader;