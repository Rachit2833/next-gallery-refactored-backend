
import DrawerClick from "@/app/_MyComponents/DrawerClick";
import ImageDetect from "@/app/_MyComponents/ImageDetect";
import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import PeopleImage from "@/app/_MyComponents/peopleComponents/PeopleImage";
import SideProfile from "@/app/_MyComponents/peopleComponents/SideProfile";
import SideFilterLayout from "@/app/_MyComponents/SideFilterLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ListFilter } from "lucide-react";
import { Suspense } from "react";





async function page({params,searchParams}) {
  const param = await params
  const searchParamValue = await searchParams
   const res = await fetch(`http://localhost:2833/label/${param.id}`);
   const newRes= await res.json()
  return (
    <>
      <div className="flex items-center">
        <SideFilterLayout year={searchParamValue.year} />
      </div>
      <Card>
        <CardHeader className="">
          <SideProfile name={newRes[0].label} />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ImageLoader />}>
            <PeopleImage name={newRes[0]._id} />
          </Suspense>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

export default page;
