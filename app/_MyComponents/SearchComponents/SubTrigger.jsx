import { removeUser } from "@/app/_lib/actions"
import { useUser } from "@/app/_lib/context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Cross, CrossIcon, EllipsisVertical, Gem, LogOut } from "lucide-react"
import LeaveDialog from "./LeaveDialog"
import { DialogTrigger } from "@/components/ui/dialog"

function SubTrigger({selId}) {
   const title = "Are you sure you want to remove these members?"
   const description = "This will remove the selected member from the group."
   const { isInfoOpen, setIsInfoOpen, selectedInGroup, setSelectedInGroup, isSelected, setIsSelected}=useUser()
   async function handleAction() {
      if (isInfoOpen) {
         const abc = selectedInGroup.length > 0 ? selectedInGroup : [selId]
         const res = await removeUser(abc, isSelected._id)
         setIsSelected(res)
      }
   }
   return (
      <>
       <Popover>
            <PopoverTrigger> <EllipsisVertical /></PopoverTrigger>
            <PopoverContent>
              

               <div className="flex  items-center">
                  <Gem />
                  <p className="text-[1rem] p-2 cursor-pointer ">Promote To Admin </p>
               </div>
               <Separator />
               <LeaveDialog buttonText="Remove" action={handleAction} title={title} description={description}>
                  <DialogTrigger className="py-2 text-red-500 flex items-center gap-2">
                    <LogOut /> Remove
                  </DialogTrigger>
               </LeaveDialog>
               
            </PopoverContent>
       </Popover>
      </>
   )
}

export default SubTrigger
