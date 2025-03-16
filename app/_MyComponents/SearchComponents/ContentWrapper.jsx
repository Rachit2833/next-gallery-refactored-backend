'use client'
import { useUser } from "@/app/_lib/context"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import gsap from "gsap"
import { Check, Edit, PlusCircleIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import GroupMembers from "./GroupMembers"
import image2 from "./image7.jpg"
import { handleGroupEdit, removeUser } from "@/app/_lib/actions"
import LeaveDialog, { SubmitButton } from "./LeaveDialog"
import { DialogTrigger } from "@/components/ui/dialog"
import AddPopOver from "./AddPopOver"
import { PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { set } from "zod"

function ContentWrapper({ children, data, userdata }) {
   const { isSelected, setMessages, setIsSelected, isInfoOpen, setIsInfoOpen, infoRef, contentRef, selectedInGroup, setSelectedInGroup, groupSelection, setGroupSelection } = useUser()
   const admins = isSelected?.people?.filter((d) => isSelected?.admin?.includes(d._id))
   const normalMembers = isSelected?.people?.filter((d) => !isSelected.admin.includes(d._id))
   const isAdmin = isSelected?.admin?.includes(localStorage.getItem("userId"))
   const title = "Are you sure you want to remove these members?"
   const description = "This will remove the selected member from the group."
   const newMembers = userdata.data?.filter((d) => !isSelected?.people?.map((e) => e._id).includes(d._id))

   const [editableField, setEditableField] = useState(null)
   const [tempValue, setTempValue] = useState("")

   async function handleAction() {
      if (selectedInGroup.length > 0) {
         const res = await removeUser(selectedInGroup, isSelected._id);
         setSelectedInGroup([]);
         setIsSelected(res);
      } 
      setGroupSelection(!groupSelection);
   }

   useEffect(() => {
      if (isInfoOpen) {
         gsap.set(infoRef.current, { display: "block" });
         gsap.fromTo(
            infoRef.current,
            { opacity: 0, y: 50 },
            { duration: 0.5, opacity: 1, y: 0, ease: "power4.out" }
         );
      }
   }, [isInfoOpen]);
   useEffect(()=>{
     setMessages([])
   },[isSelected])

   const handleClose = () => {
      gsap.to(infoRef.current, {
         duration: 0.5,
         opacity: 0,
         y: 50,
         ease: "power4.inOut",
         onComplete: () => {
            gsap.delayedCall(0.1, () => {
               setIsInfoOpen(false);
               setGroupSelection(false);
               setSelectedInGroup([]);
               setEditableField(null);
            });
         },
      });
   };

   const handleEdit = (field, value) => {
      setEditableField(field);
      setTempValue(value);
   };

   const handleSave = async(formData) => {
     const data= await handleGroupEdit(formData, isSelected._id);
     console.log(data,"skdjs");
      setEditableField(null);
      setSelectedInGroup([]); 
      setIsSelected(data);
   };

   return isSelected && !isInfoOpen ? (
      <CardContent className="flex-grow overflow-y-auto p-4">
         <ul className="flex flex-col gap-2">{children}</ul>

      </CardContent>
   ) : isInfoOpen ? (
      <div ref={infoRef} className="flex-grow relative overflow-y-auto py-4 h-[40rem]">
         <div>
            <Button className="absolute top-4 left-4" onClick={handleClose}>Back</Button>
            <Image className="h-24 w-24 mx-auto rounded-full p-1 border-4 border-white" src={isSelected?.groupImage || image2} alt="Profile" height={96} width={96} />

            {/* Editable Group Name */}
            <div className="flex justify-center items-center gap-2">
               {editableField !== "name" ? (
                  <p className="py-4 text-lg font-semibold text-center">{isSelected.name}</p>
               ) : (
                   <form action={handleSave}  className="flex gap-2  my-8 justify-center  items-center">
                     <Input name="name" className="ml-12" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                           <SubmitButton size="sm" buttonText={<Check />} variant="default" />
                  </form>
               )}
               {isAdmin && <Edit className="cursor-pointer text-gray-600 hover:text-black" onClick={() => handleEdit("name", isSelected.name)} />}
            </div>

            <div className="h-4 bg-gray-500"></div>

            {/* Editable Group Description */}
            <div className="my-6 px-6">
               <div className="flex items-center gap-2">
                     {isSelected?.admin? <p className="text-xl font-semibold">Group Description</p>:null}
                     {isAdmin && isSelected?.admin && <Edit className="cursor-pointer text-gray-600 hover:text-black" onClick={() => handleEdit("description", isSelected.description)} />}
               </div>
                  {isSelected?.admin ? null :editableField !== "description" ? (
                  <p className="truncate py-4 break-words">{isSelected.description}</p>
               ) : (
                  <form action={handleSave} className="flex gap-2 items-center">
                     <Input name="description" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                     <SubmitButton size="sm" buttonText={<Check />} variant="default" />
                  </form>
               )}
            </div>

            {/* Members Section */}
            
               {isSelected?.admin ? <div className="px-6">
                  <div className="flex items-center justify-between">
                     <p className="text-xl font-semibold">Members</p>
                     <div className="flex gap-2">
                        <AddPopOver users={newMembers}>
                           <PopoverTrigger className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90">
                              <PlusCircleIcon />
                           </PopoverTrigger>
                        </AddPopOver>
                        {isAdmin && selectedInGroup.length === 0 ? (
                           <Button onClick={() => setGroupSelection(!groupSelection)}>Select</Button>
                        ) : selectedInGroup.length > 0 ? (
                           <LeaveDialog action={handleAction} title={title} description={description}>
                              <DialogTrigger className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                 Remove
                              </DialogTrigger>
                           </LeaveDialog>
                        ) : null}
                     </div>
                  </div>

                  <div className="h-[18rem] overflow-auto">
                     {admins?.map((d, i) => (
                        <GroupMembers key={i} isAdmin={isAdmin} groupSelection={groupSelection} setGroupSelection={setGroupSelection} isSelected={isSelected} item={d} />
                     ))}
                     {normalMembers?.map((d, i) => (
                        <GroupMembers key={i} isAdmin={isAdmin} groupSelection={groupSelection} setGroupSelection={setGroupSelection} isSelected={isSelected} item={d} />
                     ))}
                  </div>
               </div> :null}
         </div>
      </div>
   ) : null;
}

export default ContentWrapper;
