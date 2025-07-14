'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import {
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Earth, PlusCircle } from "lucide-react"
import { useUser } from "../_lib/context"
import AddAlbumForm from "./AlbumsComponent/AddAlbumForm"
import ImageAlbumAddLayout from "./AlbumsComponent/ImageAlbumAddLayout"
import PasteModule from "./PasteModule"
import ToggleButton from "./ToggleButton"
import Uploadcard from "./UploadCard"
import { saveMassImages, saveNewImage } from "../_lib/actions"

function DrawerClick({ name, formType = "Image" }) {
   const {
      isOn,
      setIsOn,
      imagesPasted,
      setImagesPasted,
      getSeasons,
      location,
      setLocation,
      lat,
      long,
      getCoordinates,
      isPending
   } = useUser()

   const [isDrawerOpen, setDrawerOpen] = useState(false)
   const [uploadType, setUploadType] = useState(1)
   const [file, setFile] = useState([])
   const [globalDescription, setGlobalDescription] = useState(getSeasons || "")
   const [isSaving, setIsSaving] = useState(false)

   const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const updatedFileUrls = files.map((file) => ({
         imageFile: file,
         imageUrl: URL.createObjectURL(file)
      }));
      setFile((prevFile) => [...prevFile, ...updatedFileUrls]);
   };

const handleSave = async () => {
  const allImages = [...imagesPasted, ...file]; // From pasted and uploaded
  setIsSaving(true);

  const formData = new FormData();

  allImages.forEach((img, index) => {
    const imageFile = img?.imageFile;
    if (imageFile instanceof File || imageFile instanceof Blob) {
      formData.append("images", imageFile);
    } else {
      console.warn(`Skipped image at index ${index}`, img);
    }
  });

  formData.append("LocationName", location);
  formData.append("Description", globalDescription || "No description provided");
  formData.append("Country", "India");
  formData.append("Favourite", "false");

  const people = []; // You can fill this as needed
  formData.append("People", JSON.stringify(people));

  // DEBUG: log FormData contents
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    await saveMassImages(formData);
  } catch (err) {
    console.error("Error saving image:", err);
  }

  setIsSaving(false);
  setDrawerOpen(false);
};



   return (
      <div className="relative">
         <Drawer open={isDrawerOpen} onOpenChange={() => setDrawerOpen(!isDrawerOpen)}>
            <DrawerTrigger
               onClick={() => setDrawerOpen(true)}
               className="h-7 px-3 text-xs gap-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors"
            >
               <PlusCircle className="h-3.5 w-3.5" />
               {name}
            </DrawerTrigger>

            <DrawerContent className={formType === "Album" ? "min-h-[25rem]" : "min-h-[45rem]"}>
               {formType === "Image" ? (
                  <>
                     <div className="w-[95%] flex justify-evenly items-center gap-8 mx-auto">
                        <h1
                           onClick={() => setUploadType(1)}
                           className={`text-center w-1/2 cursor-pointer pb-1 transition-all duration-300 ease-in-out ${uploadType === 1
                              ? "border-b-4 border-black text-black font-semibold"
                              : "border-b-4 border-transparent text-gray-500"
                              }`}
                        >
                           Single Upload
                        </h1>

                        <div className="h-6 w-px bg-gray-400" />

                        <h1
                           onClick={() => setUploadType(2)}
                           className={`text-center w-1/2 cursor-pointer pb-1 transition-all duration-300 ease-in-out ${uploadType === 2
                              ? "border-b-4 border-black text-black font-semibold"
                              : "border-b-4 border-transparent text-gray-500"
                              }`}
                        >
                           Multiple Upload
                        </h1>
                     </div>

                     <Separator />

                     {uploadType === 1 ? (
                        <Uploadcard isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
                     ) : (
                        <>
                           <DrawerHeader className="relative">
                              <DrawerTitle className="text-center">
                                 Select Images from your Local Storage or Paste (Ctrl+V)
                              </DrawerTitle>

                              <Dialog>
                                 <DialogTrigger className="absolute right-4 top-4 inline-flex items-center justify-center gap-2 h-9 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow hover:bg-primary/90">
                                    Save
                                 </DialogTrigger>

                                 <DialogContent className="h-[40rem] overflow-auto">
                                    <DialogHeader>
                                       <DialogTitle>Save Images</DialogTitle>
                                       <DialogDescription>
                                          This will save all images selected by you
                                       </DialogDescription>

                                       {isOn && (
                                          <Card>
                                             <CardHeader>
                                                <CardTitle>Enter the Details for Images</CardTitle>
                                                <CardDescription>Common details for all images</CardDescription>
                                             </CardHeader>

                                             <CardContent>
                                                <Input
                                                   name="Title"
                                                   type="text"
                                                   placeholder="Describe Your Image"
                                                   value={globalDescription}
                                                   onChange={(e) => setGlobalDescription(e.target.value)}
                                                   className="border border-gray-300 p-2 rounded-lg"
                                                />

                                                <span className="my-4 block">Give Location Access</span>

                                                <div className="flex gap-4 my-4 items-center justify-between">
                                                   <Input
                                                      name="Location"
                                                      type="text"
                                                      placeholder="Location Of Your Image"
                                                      onChange={(e) => setLocation(e.target.value)}
                                                      value={location}
                                                      className="border border-gray-300 p-2 rounded-lg"
                                                   />

                                                   <Button
                                                      onClick={getCoordinates}
                                                      disabled={isPending}
                                                      className="disabled:bg-white disabled:text-black"
                                                   >
                                                      <Earth />
                                                   </Button>
                                                </div>
                                             </CardContent>
                                          </Card>
                                       )}

                                       <div className="flex justify-between my-8">
                                          <div className="flex justify-start gap-4">
                                             <ToggleButton />
                                          </div>

                                          <div className="flex justify-end gap-4">
                                             <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                                                Cancel
                                             </Button>
                                             <Button onClick={handleSave} disabled={isSaving}>
                                                {isSaving ? "Saving..." : "Save"}
                                             </Button>
                                          </div>
                                       </div>
                                    </DialogHeader>
                                 </DialogContent>
                              </Dialog>

                              <DrawerDescription className="text-center">
                                 Description and Location are editable below
                              </DrawerDescription>

                              <Input
                                 name="photo"
                                 onChange={handleFileChange}
                                 multiple
                                 className="border border-input mx-auto bg-transparent h-9 flex w-[25rem] rounded-md file:h-9 file:bg-primary file:text-white file:text-sm file:font-medium"
                                 type="file"
                              />
                           </DrawerHeader>

                           {/* SCROLLABLE MULTI UPLOAD AREA */}
                           <div className="max-h-[40rem] overflow-auto px-4 py-2 border rounded-md mt-4 ">
                              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
                                 <PasteModule additionalData={file} />
                              </div>
                           </div>
                        </>
                     )}
                  </>
               ) : formType === "Album" ? (
                  <AddAlbumForm setIsOpen={setDrawerOpen} />
               ) : (
                  <ImageAlbumAddLayout />
               )}
            </DrawerContent>
         </Drawer>
      </div>
   )
}

export default DrawerClick
