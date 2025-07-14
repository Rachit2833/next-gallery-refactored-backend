
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import ChatHeader from "../DevComp/ChatHeader";
import Content from "../DevComp/Content";
import IoMessages from "../DevComp/IoMessages";
import MessageForm from "../DevComp/MessageForm";
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
