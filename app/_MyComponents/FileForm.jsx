"use client"

import { FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { z } from "zod"
import Uploadcard from "./UploadCard"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { Deletebutton } from "./ImageCard"
import { saveNewImage } from "../_lib/actions"
function FileForm({ input = "true", urlBlob, isDrawerOpen, setDrawerOpen }) {
   return (


         
               <Uploadcard  />

   )
}

export default FileForm