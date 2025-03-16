'use client'

import { handleGroupLeave, removeUser } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogOutIcon } from "lucide-react"; // Import vertical ellipsis icon
import { useFormStatus } from "react-dom";

function LeaveDialog({children,title,description,action,buttonText}) {
   const {setIsSelected,selectedInGroup}=useUser()
   console.log("Running LeaveDialog");
   return (
      <Dialog>

             {children}
         
         <DialogContent>
            <DialogTitle>{title||"Are you sure to leave the group?"}</DialogTitle>
            <DialogDescription>{description||"Lorem, ipsum dolor sit amet consectetur adipisicing elit."}</DialogDescription>
            <form action={action} className=" flex gap-4 justify-end">
               <DialogClose className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 p-2">Cancel</DialogClose>
               <SubmitButton buttonText="Remove"  variant="destructive" />
            </form>
         </DialogContent>
      </Dialog>
   )
}

export default LeaveDialog
export function SubmitButton({ size,variant,buttonText }) {
   const { pending } = useFormStatus();
   const { selectedInGroup }=useUser()

   return (
      <Button variant={variant} size={size ||"default"} type="submit" disabled={pending}>
         {pending ? (
            <>
               <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </>
         ) : (
             buttonText|| "Leave"
         )}
      </Button>
   );
}

