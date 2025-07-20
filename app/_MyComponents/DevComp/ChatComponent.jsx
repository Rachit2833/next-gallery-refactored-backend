
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { cookies } from "next/headers";
import ChatHeader from "./ChatHeader";
import MessageForm from "./MessageForm";
import SocketWrapper from "./SocketWrapper";
import AutoSendMenu from "./AutoSendMenu";
import ContentWrapper from "./ContentWrapper";

async function ChatComponent({ children,query,decodedValue }) {

  const cookieStore = await cookies()
  
  const res = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/message/group?_id=${decodedValue.user.id}`, {headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${cookieStore.get("session").value}`,
  }
},)
  const data =await res.json()
  let user = await fetch(`https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/user/searchPeople?query=${query.search || ""}&_id=${'67cda33a43ec8895eaaaa2ab'}`,{
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  })

  let userdata = await user.json()
  
  const arrId=[]
  data.forEach((e)=>arrId.push(e._id))
  const response = await fetch("https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/labels", {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  });
  const people = await response.json();
  return (
    <Card className="h-full flex flex-col col-span-2 overflow-hidden">
      <ChatHeader  />
      <SocketWrapper joinedGroup={arrId} />
      <ContentWrapper  menu={
    <AutoSendMenu>
      <DialogTrigger className="flex justify-between items-center w-full px-2 py-1.5 text-sm font-semibold">
        <p>Change FaceId</p>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
    </AutoSendMenu>
  } data={data} userdata={userdata} AutoSendMenu={<AutoSendMenu searchParam={query}>
         <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90">
                 Enable Auto Share</DialogTrigger>
      </AutoSendMenu> }>
              {children}
         </ContentWrapper>
      <MessageForm />
    </Card>
  )
}

export default ChatComponent;
