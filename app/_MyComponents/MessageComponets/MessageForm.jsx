'use client'
import { handleSubmitMessage, sendGroupMessage } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function MessageForm() {
  const currentUserId = localStorage.getItem("userId")
  const { socket, setMessages, isSelected, isInfoOpen, setIsInfoOpen,messages } =useUser()
   async function sendMessage(formData){
       const data = await sendGroupMessage(isSelected, currentUserId, formData)
       setMessages([data, ...messages])
   }
   async function sendPrivateMessage(formData) {
     formData.append("senderId",localStorage.getItem('userId'))
     formData.append("receiverId",isSelected._id)
     formData.append("messageType","text")
     const data = await handleSubmitMessage(formData)
     setMessages([data, ...messages])
   }
   return (
     isSelected && !isInfoOpen ? <CardFooter className="p-4 border-t bg-white flex items-center">
       <form className="flex gap-6 w-full" action={isSelected?.admin?.length>0?sendMessage:sendPrivateMessage}>
         <Input name="content" type="text" placeholder="Type your message..." className="w-full h-12 rounded-lg bg-background pl-8" />
         <Button type="submit" className="h-12 w-24">Send</Button>
       </form>
     </CardFooter> :null
   )
}

export default MessageForm
