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
import { saveMassImages } from "../_lib/actions"

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
    const allImages = [...imagesPasted, ...file];
    setIsSaving(true);

    const formData = new FormData();

    allImages.forEach((img, index) => {
      const imageFile = img?.imageFile;
      if (imageFile instanceof File || imageFile instanceof Blob) {
        formData.append("images", imageFile);
      }
    });

    formData.append("LocationName", location);
    formData.append("Description", globalDescription || "No description provided");
    formData.append("Country", "India");
    formData.append("Favourite", "false");
    formData.append("detection", "true");

    const people = [];
    formData.append("People", JSON.stringify(people));

    try {
      await saveMassImages(formData);
      setImagesPasted([]);
      setFile([]);
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
              <div className="w-full flex justify-between items-center gap-4 px-4 py-2 sm:px-8">
                <h1
                  onClick={() => setUploadType(1)}
                  className={`flex-1 text-center cursor-pointer pb-1 transition-all duration-300 ease-in-out ${
                    uploadType === 1
                      ? "border-b-4 border-foreground text-foreground font-semibold"
                      : "border-b-4 border-transparent text-muted-foreground"
                  }`}
                >
                  Single Upload
                </h1>

                <div className="h-6 w-px bg-border" />

                <h1
                  onClick={() => setUploadType(2)}
                  className={`flex-1 text-center cursor-pointer pb-1 transition-all duration-300 ease-in-out ${
                    uploadType === 2
                      ? "border-b-4 border-foreground text-foreground font-semibold"
                      : "border-b-4 border-transparent text-muted-foreground"
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
                  <DrawerHeader className="relative px-4">
                    <DrawerTitle className="text-center text-base sm:text-lg">
                      Select Images from your Local Storage or Paste (Ctrl+V)
                    </DrawerTitle>

                    <Dialog>
                      <DialogTrigger className="absolute right-4 top-4 inline-flex items-center justify-center gap-2 h-9 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow hover:bg-primary/90">
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
                                className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                                />

                                <span className="my-4 block">Give Location Access</span>

                                <div className="flex flex-col sm:flex-row gap-4 my-4 items-center justify-between">
                                  <Input
                                    name="Location"
                                    type="text"
                                    placeholder="Location Of Your Image"
                                    onChange={(e) => setLocation(e.target.value)}
                                    value={location}
                                    className="w-full px-4 py-2 border rounded-md bg-muted text-muted-foreground outline-none"
                                  />

                                  <Button
                                    onClick={getCoordinates}
                                    disabled={isPending}
                                    className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Earth />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-8">
                            <ToggleButton />

                            <div className="flex gap-3 w-full sm:w-auto justify-end">
                              <Button
                                variant="secondary"
                                className="w-full sm:w-auto"
                                onClick={() => setDrawerOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="w-full sm:w-auto"
                                onClick={handleSave}
                                disabled={isSaving}
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </Button>
                            </div>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    <DrawerDescription className="text-center text-sm mt-2">
                      Description and Location are editable below
                    </DrawerDescription>

                    <Input
                      name="photo"
                      onChange={handleFileChange}
                      multiple
                     className=" sm:w-[35rem] mx-auto mt-4 w-full px-0 py-0  border  rounded-md bg-muted text-muted-foreground
             file:px-4 file:py-2 file:rounded-none file:border-none file:bg-accent 
             file:text-accent-foreground file:m-0 file:mr-4 file:rounded-l-md file:shadow-none"
                      type="file"
                    />
                  </DrawerHeader>

                  <div className="max-h-[30rem] overflow-auto px-2 py-2 border border-border rounded-md mt-4 bg-background">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <PasteModule additionalData={file} setFile={setFile} />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : formType === "Album" ? (
            <AddAlbumForm setIsOpen={setDrawerOpen} />
          ) : (
            null
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default DrawerClick
