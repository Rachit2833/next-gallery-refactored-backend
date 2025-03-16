"use client"
import { useFormStatus } from "react-dom";
import { useUser } from "../_lib/context";
import { Button } from "@/components/ui/button";

 function LoadingButton({ size,variant,buttonText }) {
   const { pending } = useFormStatus();
   const { selectedInGroup }=useUser()

   return (
      <Button variant={variant} size={size ||"default"} type="submit" disabled={pending}>
         {pending ? (
            <>
               <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </>
         ) : (
             buttonText|| "Leave"
         )}
      </Button>
   );
}
export default LoadingButton