import ImageCardGrid from "@/app/_MyComponents/AlbumsComponent/ImageCardGrid";
import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import SideFilterLayout from "@/app/_MyComponents/SideFilterLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
export const metadata = {
  title: "Albums",
  description: "Browse, organize, and manage your photo albums to relive your cherished moments on NextGallery.",
};
async function page({ params ,searchParams }) {
  const { id }= await params
  let paramval= await searchParams
  let year=paramval.year||"All"
  let sort=paramval.sort||-1
  return (
    <>
      <div className="flex items-center">
        <SideFilterLayout formType="img" year={year} />
      </div>
      <Card className="min-h-[85vh]" x-chunk="dashboard-06-chunk-0 ">
        <CardHeader>
          <CardTitle>Your Saved Images From Album August 2024</CardTitle>
          <CardDescription>
            Paste your Copied Images Here Or Directly Add Images
          </CardDescription>
        </CardHeader>
        <CardContent >
          <Suspense key={[year, sort]} fallback={<ImageLoader />}>
            <ImageCardGrid id={id} year={year} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}

export default page
