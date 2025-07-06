"use client";

import { useUser } from "@/app/_lib/context";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { Check, Edit, PlusCircleIcon, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import GroupMembers from "./GroupMembers";
import image2 from "./image7.jpg";
import { generateGroupInvite, generateShareLink, handleGroupEdit, removeUser } from "@/app/_lib/actions";
import LeaveDialog, { SubmitButton } from "./LeaveDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import AddPopOver from "./AddPopOver";
import { PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import AutoSendSetting from "./AutoSendSetting";
import LinkDialog from "./LinkDialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function ContentWrapper({ menu, children, data, userdata, AutoSendMenu }) {
   const {
      isSelected,
      setMessages,
      setIsSelected,
      isInfoOpen,
      setIsInfoOpen,
      infoRef,
      selectedInGroup,
      setSelectedInGroup,
      groupSelection,
      setGroupSelection,
      selectedImages, setIsLoadingLink: setIsLoading, url, setUrl
   } = useUser();
  const {toast} =useToast()

   const [editableField, setEditableField] = useState(null);
   const [tempValue, setTempValue] = useState("");
   const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
   };
   const description = new Date().toLocaleString("en-US", options);
   useEffect(() => {
      if (isInfoOpen) {
         gsap.set(infoRef.current, { display: "block" });
         gsap.fromTo(infoRef.current, { opacity: 0, y: 50 }, { duration: 0.5, opacity: 1, y: 0, ease: "power4.out" });
      }
   }, [isInfoOpen]);

   useEffect(() => {
      setMessages([]);
   }, [isSelected]);

   const handleClose = () => {
      gsap.to(infoRef.current, {
         duration: 0.5,
         opacity: 0,
         y: 50,
         ease: "power4.inOut",
         onComplete: () => {
            setIsInfoOpen(false);
            setGroupSelection(false);
            setSelectedInGroup([]);
            setEditableField(null);
         }
      });
   };

   const handleEdit = (field, value) => {
      setEditableField(field);
      setTempValue(value);
   };

   const handleSave = async (formData) => {
      const updatedData = await handleGroupEdit(formData, isSelected._id);
      setEditableField(null);
      setSelectedInGroup([]);
      setIsSelected(updatedData);
   };

   const handleRemoveUsers = async () => {
      if (selectedInGroup.length > 0) {
         const res = await removeUser(selectedInGroup, isSelected._id);
         setSelectedInGroup([]);
         setIsSelected(res);
      }
      setGroupSelection(!groupSelection);
   };

   return isSelected && !isInfoOpen ? (
      <CardContent className="flex-grow overflow-y-auto p-4">
         <ul className="flex flex-col gap-2">{children}</ul>
      </CardContent>
   ) : isInfoOpen ? (
      <div ref={infoRef} className="flex-grow relative overflow-y-auto py-4 h-[40rem]">
         <Button className="absolute top-4 left-4" onClick={handleClose}>Back</Button>
         <Image className="h-24 w-24 mx-auto rounded-full p-1 border-4 border-white" src={isSelected?.groupImage || image2} alt="Profile" height={96} width={96} />

         <div className="flex justify-center items-center gap-2">
            {editableField !== "name" ? (
               <p className="py-4 text-lg font-semibold text-center">{isSelected.name}</p>
            ) : (
               <form action={handleSave} className="flex gap-2 my-8 justify-center items-center">
                  <Input name="name" className="ml-12" value={tempValue} onChange={e => setTempValue(e.target.value)} />
                  <SubmitButton size="sm" buttonText={<Check />} variant="default" />
               </form>
            )}
            {isSelected?.admin?.includes(localStorage.getItem("userId")) && <Edit className="cursor-pointer text-gray-600 hover:text-black" onClick={() => handleEdit("name", isSelected.name)} />}
         </div>

         <div className="h-4 bg-gray-500"></div>

         <div className="my-6 px-6">
            {isSelected?.admin && <p className="text-xl font-semibold">Group Description</p>}
            {isSelected?.admin?.includes(localStorage.getItem("userId")) && <Edit className="cursor-pointer text-gray-600 hover:text-black" onClick={() => handleEdit("description", isSelected.description)} />}
            {editableField !== "description" ? (
               <p className="truncate py-4 break-words">{isSelected.description}</p>
            ) : (
               <form action={handleSave} className="flex gap-2 items-center">
                  <Input name="description" value={tempValue} onChange={e => setTempValue(e.target.value)} />
                  <SubmitButton size="sm" buttonText={<Check />} variant="default" />
               </form>
            )}
            {isSelected?.autoSend?.enabled ? <AutoSendSetting>{menu}</AutoSendSetting> : <LinkDialog><DialogTrigger   onClick={async () => {
                                try {
                                   setIsLoading(true);
                                   const res = await generateGroupInvite(isSelected._id, localStorage.getItem("userId"));
                                   setUrl(res);
                                   setIsLoading(false);
                                   toast({
                                       title: "Invite Generated Successfully",
                                       description: description,
                                       action: <ToastAction altText="Goto schedule to undo">Done</ToastAction>,
                                       });
                                } catch (error) {
                                    console.log(error, "hello");
                                  toast({
                                       title: "Failed to generate Link",
                                       description: error.message || "Something went wrong!",
                                       action: <ToastAction altText="Try Again">Retry</ToastAction>,
                                 });
                                }
                              }} className="rounded-md h-9 px-4 py-2 flex items-center bg-transparent border-2 transition-colors"><Share2 /></DialogTrigger></LinkDialog>}
         </div>

         {isSelected?.admin && (
            <div className="px-6">
               <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold">Members</p>
                  <div className="flex gap-2">
                     <AddPopOver users={userdata.data?.filter(d => !isSelected?.people?.some(e => e._id === d._id))}>
                        <PopoverTrigger className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90">
                           <PlusCircleIcon />
                        </PopoverTrigger>
                     </AddPopOver>
                     {isSelected?.admin?.includes(localStorage.getItem("userId")) && selectedInGroup.length > 0 && (
                        <LeaveDialog action={handleRemoveUsers} title="Are you sure you want to remove these members?" description="This will remove the selected members from the group.">
                           <DialogTrigger className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Remove</DialogTrigger>
                        </LeaveDialog>
                     )}
                  </div>
               </div>
               <div className="h-[18rem] overflow-auto">
                  {[...(isSelected?.people?.filter(d => isSelected?.admin?.includes(d._id))), ...(isSelected?.people?.filter(d => !isSelected?.admin?.includes(d._id)))].map((member, index) => (
                     <GroupMembers key={index} isSelected={isSelected} item={member} />
                  ))}
               </div>
            </div>
         )}
      </div>
   ) : null;
}

export default ContentWrapper;
