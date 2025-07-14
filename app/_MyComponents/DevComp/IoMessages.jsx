'use client'
import { useUser } from "@/app/_lib/context"
import Messages from "./Messages"

function IoMessages() {
   const { messages } = useUser();
   console.log(messages, "messages");

   return (
      [...messages].reverse().map((message, index) => (
         <Messages key={index} message={message} />
      ))
   );
}

export default IoMessages;
