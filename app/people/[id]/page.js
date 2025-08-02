import ImageLoader from "@/app/_MyComponents/Loaders/ImageLoader";
import PeopleImage from "@/app/_MyComponents/peopleComponents/PeopleImage";
import SideProfile from "@/app/_MyComponents/peopleComponents/SideProfile";
import SideFilterLayout from "@/app/_MyComponents/SideFilterLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CloudCog } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";
export const metadata = {
  title: "People",
  description: "View all the people detected in your photo collection using smart face recognition.",
};

async function page({ params, searchParams }) {
  const param = await params;
  const cookieStore = await cookies();
  const searchParamValue = await searchParams;
  const {sort,page,year}=searchParams
  const res = await fetch(`http://localhost:2833/label/${param.id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  });
  const newRes = await res.json();
  return (
    <>
        <SideFilterLayout year={searchParamValue.year} />
      <Card  className="w-full max-w-screen-2xl mx-auto overflow-hidden">
        <CardHeader >
          <SideProfile res={newRes[0]} />
        </CardHeader>
        <CardContent>
          <Suspense key={[sort,page,year]} fallback={<ImageLoader />}>
            <PeopleImage param={searchParamValue} name={newRes[0]} />
          </Suspense>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
export default page