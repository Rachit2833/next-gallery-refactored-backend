import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Suspense } from "react";
import SeachBar from "../SeachBar";
import FriendList from "../peopleComponents/FriendList";
import AddPeopleFolder from "./AddPeopleFolder";
import { cookies } from "next/headers";

async function MessageList({ query,decodedValue }) {
   const cookieStore =await  cookies();
   const sessionToken = cookieStore.get("session")?.value;
   const userId = decodedValue?.user?.id;

   const searchPeopleResponse = await fetch(`http://localhost:2833/friends?id=${userId}`, {
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${sessionToken}`,
      },
   });

   const searchResults = await searchPeopleResponse.json();
   console.log(searchResults,"sfs");
   const groupResponse = await fetch(`http://localhost:2833/message/group?_id=${userId}`, {
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${sessionToken}`,
      },
   });

   const groupResults = await groupResponse.json();
   


   return (
      <Card className="h-full overflow-hidden m-0 p-0 flex flex-col">
         <CardHeader className="px-0">
            <div className="px-4">
               <SeachBar>
                  <ul className="cursor-pointer">
                     <AddPeopleFolder res={searchResults} />
                  </ul>
               </SeachBar>
            </div>
            <div className="flex bg-green-400 mb-4 p-2 px-8 gap-2 w-full h-16 items-center">
               <PlusCircle className="h-12 w-12" />
               <div className="flex flex-col justify-center h-full">
                  <h1 className="text-[royalblue] cursor-pointer">
                     Search And Add Friends Near You
                  </h1>
               </div>
            </div>
         </CardHeader>
         <CardContent className="flex-grow overflow-auto">
            <Suspense fallback={<div>Loading...</div>}>
               <FriendList userId={userId} res={searchResults} resGroup={groupResults} searchParams={query} />
            </Suspense>
         </CardContent>
         <CardFooter />
      </Card>
   );
}

export default MessageList;
