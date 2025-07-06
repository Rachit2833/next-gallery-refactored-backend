'use client'

import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import FileForm from "./FileForm"
import { useState } from "react"
import Uploadcard, { Earthbutton } from "./UploadCard"
import AddAlbumForm from "./AlbumsComponent/AddAlbumForm"
import ImageAlbumAddLayout from "./AlbumsComponent/ImageAlbumAddLayout"
import { Separator } from "@/components/ui/separator"
import PasteCards from "./AlbumsComponent/PasteCards"
import { useSearchParams } from "next/navigation"
import ToggleButton from "./ToggleButton"
import { useUser } from "../_lib/context"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PasteCardDummy from "./PasteCardDummy"

function DrawerClick({ name, formType = "Image" }) {
   const [isDrawerOpen, setDrawerOpen] = useState(false)
   const [uploadType, setUploadType] = useState(1)
   const [file, setFile] = useState([]) // Store image preview URLs
   const [fileBlob, setFileBlob] = useState([]) // Store actual file objects
   const params = useSearchParams()
   const { isOn, setIsOn } = useUser()

   // Handle file input change for multiple files
   const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const updatedFileUrls = files.map((file) => URL.createObjectURL(file)); // Create URLs for file preview
      const updatedFileBlobs = files; // Keep original files in a separate array for upload

      // Update state with new files
      setFile((prevFile) => [...prevFile, ...updatedFileUrls]);
      setFileBlob((prevFileBlob) => [...prevFileBlob, ...updatedFileBlobs]);
   };

   return (
      <div className="relative">
         <Drawer open={isDrawerOpen} onOpenChange={() => setDrawerOpen(!isDrawerOpen)}>
            <DrawerTrigger onClick={() => setDrawerOpen(true)} className={`h-7 px-3 text-xs gap-1 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`} >
               <PlusCircle className="h-3.5 w-3.5" />
               {name}
            </DrawerTrigger>
            <DrawerContent className="min-h-[45rem]">
               {formType === "Image" ?
                  <>
                     <div className="w-[95%] flex justify-evenly items-center gap-8 mx-auto">
                        <h1
                           onClick={() => setUploadType(1)}
                           className={`text-center w-1/2 cursor-pointer transition-all duration-300 ease-in-out pb-1 ${uploadType === 1
                              ? "border-b-4 border-black text-black font-semibold"
                              : "border-b-4 border-transparent text-gray-500"
                              }`}
                        >
                           Single Upload
                        </h1>

                        <div className="h-6 w-px bg-gray-400" />

                        <h1
                           onClick={() => setUploadType(2)}
                           className={`text-center w-1/2 cursor-pointer transition-all duration-300 ease-in-out pb-1 ${uploadType === 2
                              ? "border-b-4 border-black text-black font-semibold"
                              : "border-b-4 border-transparent text-gray-500"
                              }`}
                        >
                           Multiple Upload
                        </h1>
                     </div>

                     <Separator />

                     {uploadType === 1 ? <Uploadcard isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} /> :
                        <>
                           <DrawerHeader className="relative">
                              <DrawerTitle className="text-center">Select Images from your Local Storage or directly Paste images using ctrl V</DrawerTitle>

                              <Dialog>
                                 <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 absolute right-4 top-4">Save</DialogTrigger>
                                 <DialogContent>
                                    <DialogHeader>
                                       <DialogTitle>Save Images</DialogTitle>
                                       <DialogDescription>
                                          This will save all images selected by you
                                       </DialogDescription>
                                       {isOn ? <Card>
                                          <CardHeader>
                                             <CardTitle>Enter the Details for Images</CardTitle>
                                             <CardDescription>The details entered will be common for all images</CardDescription>

                                          </CardHeader>
                                          <CardContent>
                                             <form>
                                                <Input
                                                   name="Title"
                                                   type="text"
                                                   placeholder="Describe Your Image"
                                                   className="border border-gray-300 p-2 rounded-lg"
                                                />
                                                <div className="flex gap-4 my-4 items-center justify-between">
                                                   <h2>Give Location Access</h2>

                                                   <Earthbutton type="button" />

                                                </div>
                                                <Button type="submit" >Save Image</Button>
                                             </form>
                                          </CardContent>
                                       </Card> : null}
                                       <div className="flex justify-between my-8 ">
                                          <div className="flex justify-start gap-4">
                                             <ToggleButton />
                                          </div>

                                          <div className="flex justify-end gap-4">
                                             <Button variant="outline">Cancel</Button>
                                             <Button>Save</Button>
                                          </div>
                                       </div>
                                    </DialogHeader>
                                 </DialogContent>
                              </Dialog>
                              <DrawerDescription className="text-center">Description and Location can be Editable from the Input Fields Below</DrawerDescription>

                              {/* Input for file upload */}
                              <Input
                                 name="photo"
                                 onChange={handleFileChange}
                                 multiple
                                 className="border border-input mx-auto bg-transparent h-9 flex w-[25rem] rounded-md file:h-9 file:bg-primary file:text-white file:text-sm file:font-medium"
                                 type="file"
                                 id="picture"
                              />

                              {/* Render uploaded images as preview cards */}

                                 <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4 ">
                                
                                 </div>

                           </DrawerHeader>
                           <PasteCards query={params?.query || null} res={params?.res || null} cod={params?.cod || null} frId={params?.frId}>
                              {file.map((fileUrl, index) => (
                                 <PasteCardDummy key={index} urlBlob={fileUrl} />
                              ))}
                           </PasteCards>
                        </>
                     }
                  </>
                  : formType === "Album" ? <AddAlbumForm setIsOpen={setDrawerOpen} /> : <ImageAlbumAddLayout />}
            </DrawerContent>
         </Drawer>
      </div>
   )
}

export default DrawerClick
