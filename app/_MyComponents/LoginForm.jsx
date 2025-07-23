'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { loginUser,} from "../_lib/actions";
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";
import { CloudCog } from "lucide-react";

function LoginForm() {
   const router= useRouter()
   return (
      <Card className="w-[30rem] ">
         <form action={async (formData) => {
            const data = await loginUser(formData)
            console.log(data)
            if (data) {
               router.push("/");
               localStorage.setItem("userId", data.userId);
            }
         }}>
            <CardHeader>
               <CardTitle>Login</CardTitle>
               <CardDescription>We missed you,Welcome Back</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-col gap-4">
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
                     Don't have a account?
                     <Link className="text-blue-500" href="/sign-up">
                        Signup
                     </Link>
                  </p>
               </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
               <Button   variant="outline" type="button"> Cancel</Button>
               <LoadingButton buttonText="Login" type="submit" />

            </CardFooter>
         </form>
      </Card>
   )
}

export default LoginForm
