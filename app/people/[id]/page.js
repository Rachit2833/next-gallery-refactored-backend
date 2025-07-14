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

async function page({ params, searchParams }) {
  const param = await params;
  const cookieStore = await cookies();
  const searchParamValue = await searchParams;
  const res = await fetch(`http://localhost:2833/label/${param.id}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  });
  const newRes = await res.json();
  console.log(newRes[0],"noj")
  return (
    <>
      <div className="flex items-center">
        <SideFilterLayout year={searchParamValue.year} />
      </div>
      <Card>
        <CardHeader className="">
          <SideProfile res={newRes[0]} />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ImageLoader />}>
            <PeopleImage name={newRes[0]} />
          </Suspense>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
export default page