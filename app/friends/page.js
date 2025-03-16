
import ChatComponent from "../_MyComponents/SearchComponents/ChatComponent";
import MessageList from "../_MyComponents/SearchComponents/MessageList";
import { Suspense } from "react";

import IoMessages from "../_MyComponents/MessageComponets/IoMessages";
import Content from "../_MyComponents/MessageComponets/Content";
import { cookies } from "next/headers";

async function Page({ searchParams }) {
  const query = await searchParams;
  const cookieStore =await  cookies();
    const sessionToken = cookieStore.get("session")?.value;
 
    const verifyUserResponse = await fetch("http://localhost:2833/user/verify-user", {
       method: "POST",
       headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${sessionToken}`,
       },
    });
    const decodedValue = await verifyUserResponse.json();

  return (
    <div className="grid grid-cols-3 gap-4 h-[90vh]  p-2 overflow-hidden">
      <MessageList decodedValue={decodedValue} query={query} />
      <ChatComponent decodedValue={decodedValue} query={query}>
        <Suspense fallback="Loading...">
          <Content query={query} decodedValue={decodedValue} />
        </Suspense>
        <IoMessages />
      </ChatComponent>
    </div>
  );
}

export default Page;
