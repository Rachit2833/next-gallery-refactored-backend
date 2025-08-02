'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginUser } from "../_lib/actions";
import LoadingButton from "./LoadingButton";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md md:shadow-lg md:rounded-2xl border">
      <form
        action={async (formData) => {
          const data = await loginUser(formData);
          console.log(data);
          if (data) {
            localStorage.setItem("userId", data.userId);
            router.push("/");
          }
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>We missed you, welcome back!</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              name="email"
              type="text"
              placeholder="Email"
              className="border border-input p-2 rounded-lg"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="border border-input p-2 rounded-lg"
              required
            />
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link className="text-blue-500 hover:underline" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <LoadingButton buttonText="Login" type="submit" />
        </CardFooter>
      </form>
    </Card>
  );
}

export default LoginForm;
