'use client'
import { useUser } from "@/app/_lib/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import image from "./image7.jpg"
import image2 from "./image6.jpg"
import { useState } from "react"
import { addGroup } from "@/app/_lib/actions"

function GroupMenu() {
   const { groupMenu, setGroupMenu, selectedInGroup } = useUser();
   const [imageSelected, setImageSelected] = useState(null);
   const [userId, setUserId] = useState(null);

   // Get userId safely
   useState(() => {
      setUserId(localStorage.getItem("userId"));
   }, []);

   const handleFileChange = (e) => {
      const file = e.target.files[0]; // Get the selected file
      if (file) {
         const imageUrl = URL.createObjectURL(file); // Create a preview URL
         setImageSelected(imageUrl);
      }
   };

   return (
      <>
         {groupMenu && (
            <Card className="w-1/2">
               <CardHeader className="flex justify-center items-center">
                  {!imageSelected ? (
                     <label className="relative w-24 h-24 z-40 rounded-full border-2 border-black bg-card flex justify-center items-center cursor-pointer overflow-hidden">
                        <Image
                           alt="grp placeholder"
                           src={image2}
                           height={96}
                           width={96}
                           className="object-cover w-full h-full"
                        />
                     </label>
                  ) : (
                     <div className="w-24 h-24 rounded-full overflow-hidden">
                        <Image
                           alt="photo"
                           src={imageSelected}
                           height={96}
                           width={96}
                           className="object-cover w-full h-full"
                        />
                     </div>
                  )}
               </CardHeader>

               {/* Move the form outside CardHeader */}
               <CardContent className="flex flex-col gap-4">
                  <form action={(formData) => addGroup(formData, selectedInGroup, userId)}>
                     <div className="grid w-full grid-cols-2 items-center gap-1.5">
                        <div className="col-span-2">
                           <Label htmlFor="Group Name">Group Name</Label>
                           <Input
                              required
                              name="name"
                              className="w-full"
                              id="Group Name"
                              placeholder="Add Name of the Group in 15 characters or less"
                              type="text"
                           />
                        </div>

                        <Label className="col-span-3" htmlFor="Description">Description</Label>
                        <textarea
                           name="description"
                           id="Description"
                           rows={6}
                           className="w-full px-3 rounded-lg border border-input col-span-3 bg-transparent"
                           placeholder="Enter group Description"
                        />
                        <Label className="col-span-3" htmlFor="People">People</Label>
                        <div className="my-2" id="people">
                           <div className="flex px-3">
                              {selectedInGroup.map((_, i) => (
                                 <Image key={i} className=" -mx-3 border-2 border-white rounded-full" width={48} height={32} alt="People" src={image} />
                              ))}
                           </div>
                        </div>
                     </div>

                     <Input onChange={handleFileChange} className="my-4 w-1/2" type="file" name="photo" />

                     <div className="flex gap-4">
                        <Button onClick={() => setGroupMenu(false)} type="button" variant="outline">Cancel</Button>
                        <Button type="submit">Add Group</Button>
                     </div>
                  </form>
               </CardContent>

               <CardFooter className="flex gap-2 justify-end"></CardFooter>
            </Card>
         )}
      </>
   );
}

export default GroupMenu;
