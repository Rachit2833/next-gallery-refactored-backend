
import DrawerClick from "@/app/_MyComponents/DrawerClick";
import ImageDetect from "@/app/_MyComponents/ImageDetect";
import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import PeopleImage from "@/app/_MyComponents/peopleComponents/PeopleImage";
import SideProfile from "@/app/_MyComponents/peopleComponents/SideProfile";
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





async function page({params}) {
  const param = await params
   const res = await fetch(`http://localhost:2833/label/${param.id}`);
   const newRes= await res.json()

  return (
    <>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">2024</TabsTrigger>
          <TabsTrigger value="draft">2023</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            2022
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Oldest to Newest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                {" "}
                Newest to Oldest
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Download
            </span>
          </Button>
          <DrawerClick name={"Add Images"} />
        </div>
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
