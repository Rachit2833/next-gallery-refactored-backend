import { Suspense } from "react";
import ShareImages from "../_MyComponents/SearchComponents/ShareImages";
import ShareWrapper from "../_MyComponents/SearchComponents/ShareWrapper";
import ImageLoader from "../_MyComponents/Loaders/ImageLoader";

export const metadata = {
  title: "Share",
  description: "Share your favorite memories and albums with friends and family through secure links on NextGallery.",
};
async function page({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <ShareWrapper params={params} />
      <Suspense fallback={<ImageLoader />}>
        <ShareImages params={params} />
      </Suspense>
    </>
  );
}
