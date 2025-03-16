
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import ChatHeader from "../MessageComponets/ChatHeader";
import Content from "../MessageComponets/Content";
import IoMessages from "../MessageComponets/IoMessages";
import MessageForm from "../MessageComponets/MessageForm";
function ChatWrapper() {
   return (
      <Card className="h-full flex flex-col col-span-2 overflow-hidden">
         <ChatHeader groupId={isSelected} joinedGroup={arrId} />
         <CardContent className="flex-grow overflow-y-auto p-4">
            <ul className="flex flex-col gap-2">
               {children}

              
            </ul>
         </CardContent>
         <MessageForm isSelected={isSelected} />
      </Card>
   )
}

export default ChatWrapper
