"use client"
import { Button } from "@/components/ui/button";
import {
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { signUpUser } from "../_lib/actions.js";

function SignUpForm() {
   const router = useRouter()
   async function handleSubmit(formData) {
      const data = await signUpUser(formData);
      if (data) {
         router.push("/");
         localStorage.setItem('userId', data.user._id)
      }
   }
   return (
      <form action={handleSubmit}>
         <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Welcome,Let's get you started</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex flex-col gap-4">
               <Input
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="border border-gray-300 p-2 rounded-lg"
               />
               <Input
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="border border-gray-300 p-2 rounded-lg"
               />
               <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="border border-gray-300 p-2 rounded-lg"
               />
               <p>
                  Already have a account?
                  <Link className="text-blue-500" href="/login">
                     {" "}
                     Login
                  </Link>
               </p>
            </div>
         </CardContent>
         <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="submit">
               Cancel
            </Button>
            <SubmitButton variant="default" buttonText="Continue" type="submit">
               Continue <ArrowRight />
            </SubmitButton>
         </CardFooter>
      </form>
   )
}

export default SignUpForm
export function SubmitButton({ size, variant, buttonText }) {
   const { pending } = useFormStatus();

   return (
      <Button variant={variant} size={size || "default"} type="submit" className="w-full" disabled={pending}>
         {pending ? (
            <>
               <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </>
         ) : (
            buttonText || "Leave"
         )}
      </Button>
   );
}


