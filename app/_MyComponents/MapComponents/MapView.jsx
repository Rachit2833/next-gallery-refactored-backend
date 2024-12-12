import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import {Sheet,SheetContent,SheetDescription,SheetHeader,SheetOverlay,SheetTitle,} from "@/components/ui/sheet";
import { Suspense, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MapSideImageLoader from "../Loaders/MapSideImageLoader";
import Map from "./Map";
import MapSideOptionLoader from "../Loaders/MapSideOptionLoader";
import Filter from "../Filter";
function MapView({ imageCard, Location, sideField, yearRange, paramLoc }) {
   const [isOpen, setIsOpen] = useState(false);
   const [location, setLocation] = useState();
   const searchParams = useSearchParams()
   const router = useRouter()
   const pathname = usePathname()
   const filterArray = [{ label: "All", value: "All" },{ label: "1 yrs", value: 1 }, { label: "3 yrs", value: 3 }, { label: "5 yrs", value: 5 }]
   return (
      <div className="flex flex-col space-y-4 h-[70vh] relative">
         <Card>
            <CardHeader>
               <CardTitle>Access All of your Memories in the Map</CardTitle>
               <CardDescription>
                  Note: Memories with invalid or imaginary location won't appear on Memory-Map
               </CardDescription>
            </CardHeader>
            <CardContent className="grid  grid-cols-6 gap-4 relative">
               <Map Location={Location} isOpen={isOpen} setIsOpen={setIsOpen} paramLoc={paramLoc} />
               <Card className=" col-span-2 ">
                  <CardContent className=" m-4 p-0">
                     <Filter paramName="yearRange" year={yearRange} values={filterArray} defaultValue="All" />
                     <Suspense key={yearRange}   fallback={<MapSideOptionLoader />}>
                        {sideField}
                     </Suspense>
                  </CardContent>
               </Card>
                  <Sheet
                     open={isOpen}
                     onOpenChange={setIsOpen}
                     className="absolute top-0 right-0 z-50 h-full"
                  >
                     <SheetOverlay className="bg-white/10" />
                     <SheetContent side="right" className="sm:max-w-[50rem] overflow-auto">
                        <SheetHeader className="w-full">
                           <SheetTitle>Memories From This Location</SheetTitle>
                           <SheetDescription>{paramLoc}</SheetDescription>
                        </SheetHeader>
                          <Suspense key={paramLoc} fallback={<MapSideImageLoader />} >
                           {imageCard}
                          </Suspense>
                     </SheetContent>
                  </Sheet>
            </CardContent>
         </Card>
      </div>
   );
}

export default MapView;


