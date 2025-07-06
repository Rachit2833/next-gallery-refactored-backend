import { Children, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings } from "lucide-react";
import { toggleAutoSend } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import { SubmitButton } from "./LeaveDialog";

function AutoSendSetting({children}) {
   const { isOpen, setIsOpen, isSelected, isEnabled,setIsEnabled, } = useUser()
   const [open, setOpen] = useState(false);

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button>AutoSend Settings</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
               <DropdownMenuLabel className="flex justify-between items-center">
                  AutoSend <Settings />
               </DropdownMenuLabel>
               <DropdownMenuSeparator />

                {children}

               <DropdownMenuSeparator />
               <DropdownMenuItem onSelect={() => setOpen(true)}>Disable AutoSend</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Confirmation Dialog */}
         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Disable AutoSend?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to disable AutoSend? This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  <form action={async () => await toggleAutoSend(isSelected.rId, isSelected.autoSend.enabled ? 1 : 2,isSelected.idBit)}>
                     <SubmitButton type="submit" onClick={() => {
                        setOpen(false);
                        console.log("AutoSend Disabled"); // Replace with actual disable logic
                     }}>
                        Disable
                     </SubmitButton>
                  </form>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}

export default AutoSendSetting;
