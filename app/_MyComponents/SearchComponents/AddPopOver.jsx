import { useState } from "react"
import { Popover, PopoverContent } from "@/components/ui/popover"
import SelectPeople from "./SelectPeople"
import { Button } from "@/components/ui/button"
import { addUser } from "@/app/_lib/actions"
import { useUser } from "@/app/_lib/context"
import { SubmitButton } from "./LeaveDialog"
import { set } from "zod"

function AddPopOver({ children, users }) {
   const { groupSelection, setIsSelected, setGroupSelection, selectedInGroup, setSelectedInGroup, isSelected } = useUser()
   const [open, setOpen] = useState(false)
   function openChnage(){
      setSelectedInGroup([])
      setOpen(false)
   }
   return (
      <Popover open={open} onOpenChange={openChnage}>
         <div onClick={() =>{ 
            setGroupSelection(false)
            setSelectedInGroup([])
            setOpen(!open)}}>{children}</div>
         <PopoverContent>
            <h1 className="text-lg font-semibold">Add Members</h1>
            <div className="h-[15rem] overflow-auto">
               {users?.map((item, index) => (
                  <SelectPeople key={index} item={item} />
               ))}
            </div>
            <form action={async() => {
               const res= await addUser(selectedInGroup, isSelected._id)
               setOpen(false)
               setIsSelected(res)
               setSelectedInGroup([])
             }} className="flex justify-end mt-4">

               <SubmitButton variant="default" buttonText="Add Members"  />
            </form>
         </PopoverContent>
      </Popover>
   )
}

export default AddPopOver

