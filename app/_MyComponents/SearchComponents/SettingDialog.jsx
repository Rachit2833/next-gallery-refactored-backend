
'use client'

import { useUser } from "@/app/_lib/context";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SubmitButton } from "./LeaveDialog";


function SettingDialog({ children, title, description, action, buttonText }) {
   const { setIsSelected, selectedInGroup } = useUser()
   console.log("Running SettingDialog");
   return (
      <Dialog>

         {children}

         <DialogContent>
            <DialogTitle>{title || "Are you sure to leave the group?"}</DialogTitle>
            <DialogDescription>{description || "Lorem, ipsum dolor sit amet consectetur adipisicing elit."}</DialogDescription>
            <form action={action} className=" flex gap-4 justify-end">
               <DialogClose className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 p-2">Cancel</DialogClose>
               <SubmitButton buttonText="close"  />
            </form>
         </DialogContent>
      </Dialog>
   )
}

export default SettingDialog