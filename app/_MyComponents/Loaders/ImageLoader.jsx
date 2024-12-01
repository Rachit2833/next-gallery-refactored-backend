import { Skeleton } from "@/components/ui/skeleton";

function ImageLoader({gridNumber}) {
   const arr = Array.from({ length: 9 });

   return (
      <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
         {arr.map((_, i) => (
            <div key={i} className="mx-auto bg-white rounded-lg shadow-md p-4 w-full max-w-xs lg:max-w-sm">
               <div className="relative w-full h-[15rem] bg-gray-200 rounded-t-lg cursor-pointer overflow-hidden">
                  <Skeleton className="rounded-t-lg" />
               </div>
               <div className="overflow-y-auto max-h-24 mt-2">
                  <Skeleton  className="w-[20%] h-4" />
                  <Skeleton className="heading h-10 mt-1" />
               <div className="text-xs  text-gray-500 mt-4 sm:block hidden">
                     <Skeleton className="h-4 font-semibold hover:cursor-pointer" />
               </div>
            </div>
      </div>
         ))}
      </div>
   );
}

export default ImageLoader;
