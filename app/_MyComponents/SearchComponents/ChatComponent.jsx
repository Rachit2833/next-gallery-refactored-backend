
import { Card, CardContent } from "@/components/ui/card";
import ChatHeader from "../MessageComponets/ChatHeader";
import MessageForm from "../MessageComponets/MessageForm";
import Messages from "../MessageComponets/Messages";
import IoMessages from "../MessageComponets/IoMessages";
import { Suspense } from "react";
import Content from "../MessageComponets/Content";
import GroupMenu from "../MessageComponets/GroupMenu";
import ContentWrapper from "./ContentWrapper";
import SocketWrapper from "../peopleComponents/SocketWrapper";
import { cookies } from "next/headers";

async function ChatComponent({ children,query,decodedValue }) {
  
  const cookieStore = await cookies()
  
  const res = await fetch(`http://localhost:2833/message/group?_id=${decodedValue.user.id}`, {headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${cookieStore.get("session").value}`,
  }
},)
  const data =await res.json()
  let user = await fetch(`http://localhost:2833/user/searchPeople?query=${query.search || ""}&_id=${'67cda33a43ec8895eaaaa2ab'}`,{
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  })

  let userdata = await user.json()
  
  const arrId=[]
  data.forEach((e)=>arrId.push(e._id))
  return (
    <Card className="h-full flex flex-col col-span-2 overflow-hidden">
      <ChatHeader  />
      <SocketWrapper joinedGroup={arrId} />
         <ContentWrapper data={data} userdata={userdata}>
              {children}
         </ContentWrapper>
      <MessageForm />
    </Card>
  )
}

export default ChatComponent;
