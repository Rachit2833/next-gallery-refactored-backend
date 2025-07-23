import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Friends from "../_MyComponents/peopleComponents/Friends";
import PeopleAvatar from "../_MyComponents/peopleComponents/PeopleAvatar";
import PeopleAvatarFull from "../_MyComponents/peopleComponents/PeopleAvatarFull";

export const metadata = {
  title: "People",
  description: "View all the people detected in your photo collection using smart face recognition.",
};

function Page() {
  return (
    <>
      <Card>
        <CardHeader className="border-b-4">
          <CardTitle>Capture Moments, Share Memories</CardTitle>
          <CardDescription>
            Discover unforgettable memories with friends. Relive and cherish
            each captured moment together.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Friends children2={<PeopleAvatarFull /> }>
            <PeopleAvatar />
          </Friends>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
export default Page
