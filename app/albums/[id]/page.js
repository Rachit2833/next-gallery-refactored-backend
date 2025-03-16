import AlbumFilter from "@/app/_MyComponents/AlbumsComponent/AlbumFilter";
import ImageCardGrid from "@/app/_MyComponents/AlbumsComponent/ImageCardGrid";
import PasteCards from "@/app/_MyComponents/AlbumsComponent/PasteCards";
import DrawerClick from "@/app/_MyComponents/DrawerClick";
import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import SideFilterLayout from "@/app/_MyComponents/SideFilterLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function page({ params ,searchParams }) {
  const { id }= await params
  let year= await searchParams
  year=year.year
   function handleParams(filter) {
     if (!searchParams) return; // Ensure searchParams are loaded

     const params = new URLSearchParams(searchParams);
     params.set("year", filter);

     router.replace(`${pathname}?${params}`, { scroll: false });
   }
  return (
    <>
      <div className="flex items-center">
        <SideFilterLayout formType="img" year={year} />
      </div>
      <Card className="h-[85vh]" x-chunk="dashboard-06-chunk-0 ">
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
    </>
  );
}

export default page
