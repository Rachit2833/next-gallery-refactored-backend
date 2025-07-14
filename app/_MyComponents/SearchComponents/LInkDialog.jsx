import { useUser } from "@/app/_lib/context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { useState } from "react";

function LInkDialog({children,}) {
   const [copied, setCopied] = useState(false);
   const handleCopy = () => {
      navigator.clipboard.writeText(url).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000); // Hide after 2 sec
      });
   };
   const { isLoadingLink: isLoading, setIsLoadingLink: setIsLoading, url, setUrl }=useUser()
   console.log(url)
   return (
      <Dialog>
         {children}
         <DialogContent>
            <DialogTitle>Link Generated</DialogTitle>
            <DialogDescription>This link is valid for only 6hrs</DialogDescription>
            {isLoading ? (
               <p>Loading...</p>
            ) : (
               <>
                  <div className="relative">
                     <input
                        className="w-full pl-14 h-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400"
                        type="text"
                        value={url}
                        readOnly
                     />
                     <Button
                        onClick={handleCopy}
                        className="absolute h-10 rounded-l-md flex justify-center items-center align-middle w-12 top-0 bg-black hover:bg-gray-800 transition"
                     >
                        <Copy className="hover:scale-110 text-white w-5 h-5" />
                     </Button>
                     {copied && (
                        <span className="absolute right-0 top-12 text-xs text-green-500 bg-white p-1 rounded-md shadow-md">
                           Copied!
                        </span>
                     )}
                  </div>
                  <div className="flex mt-4 justify-end">
                     <DialogClose className="bg-black text-white rounded-md w-16 h-10">Done</DialogClose>
                  </div>
               </>
            )}
         </DialogContent>
      </Dialog>
   )
}

export default LInkDialog
