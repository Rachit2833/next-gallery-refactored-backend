"use client"

import dynamic from "next/dynamic";
const CameraUi = dynamic(() => import("./CameraUi"), { ssr: false });

function Camerawrapper() {
   return (
       <CameraUi />
   )
}

export default Camerawrapper
