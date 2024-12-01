import AlbumFilter from "@/app/_MyComponents/AlbumsComponent/AlbumFilter";
import ImageCardGrid from "@/app/_MyComponents/AlbumsComponent/ImageCardGrid";
import PasteCards from "@/app/_MyComponents/AlbumsComponent/PasteCards";
import DrawerClick from "@/app/_MyComponents/DrawerClick";
import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  ListFilter
} from "lucide-react";
import { Suspense } from "react";

async function page({ params ,searchParams }) {
  const { id }= await params
  let year= await searchParams
  year=year.year
  console.log(year,"year");
   function handleParams(filter) {
     if (!searchParams) return; // Ensure searchParams are loaded

     const params = new URLSearchParams(searchParams);
     params.set("year", filter);

     router.replace(`${pathname}?${params}`, { scroll: false });
   }
  return (
    <>
      <div className="flex items-center">
        <AlbumFilter />
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

          <DrawerClick />
        </div>
      </div>
      <TabsContent value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Your Saved Images From Album August 2024</CardTitle>
            <CardDescription>
              Paste your Copied Images Here Or Directly Add Images
            </CardDescription>
          </CardHeader>
          <CardContent>
                   <Suspense key={year} fallback={<ImageLoader />}> 
                   <ImageCardGrid id={id} year={year} />
                  </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="2024">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Your Saved Images From Album August 2024</CardTitle>
            <CardDescription>
              Paste your Copied Images Here Or Directly Add Images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense key={year} fallback={<ImageLoader />}>  
             <ImageCardGrid id={id} year={year} />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="2023">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Your Saved Images From Album August 2024</CardTitle>
            <CardDescription>
              Paste your Copied Images Here Or Directly Add Images
            </CardDescription>
          </CardHeader>
          <CardContent>
                   <Suspense key={year} fallback={<ImageLoader />}>
                   <ImageCardGrid id={id} year={year} />
                  </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="2022">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Your Saved Images From Album August 2024</CardTitle>
            <CardDescription>
              Paste your Copied Images Here Or Directly Add Images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense key={year} fallback={<ImageLoader />}>
             <ImageCardGrid id={id} year={year} />
            </Suspense>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}

export default page
