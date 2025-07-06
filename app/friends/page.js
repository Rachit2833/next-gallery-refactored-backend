import ChatComponent from "../_MyComponents/SearchComponents/ChatComponent";
import MessageList from "../_MyComponents/SearchComponents/MessageList";
import { Suspense } from "react";

import IoMessages from "../_MyComponents/MessageComponets/IoMessages";
import Content from "../_MyComponents/MessageComponets/Content";
import { cookies } from "next/headers";
import GroupDrawer from "../_MyComponents/SearchComponents/GroupDrawer";
import GroupData from "../_MyComponents/SearchComponents/GroupData";
import DrawerWapper from "../_MyComponents/DrawerWapper";

async function Page({ searchParams }) {
  const query = await searchParams;
  console.log(query, "hello");
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  const verifyUserResponse = await fetch(
    "http://localhost:2833/user/verify-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const decodedValue = await verifyUserResponse.json();
  const res = await fetch(
    `http://localhost:2833/message/group/invite?inviteId=${query.inviteId}`
  );
  const data = await res.json();
  const group = data?.data?.inviteId;

  return (
    <div className="grid grid-cols-3 gap-4 h-[90vh]  p-2 overflow-hidden">
      <MessageList decodedValue={decodedValue} query={query} />
      <ChatComponent decodedValue={decodedValue} query={query}>
        <Suspense fallback="Loading...">
          <Content
            sessionToken={sessionToken}
            query={query}
            decodedValue={decodedValue}
          />
        </Suspense>
        <IoMessages />
      </ChatComponent>
      {query.inviteId ? (
        <DrawerWapper group={group} inviteId={query.inviteId} />
      ) : null}
    </div>
  );
}
