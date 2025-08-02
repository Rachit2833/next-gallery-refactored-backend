import { Card } from "@/components/ui/card";
import SignUpForm from "../_MyComponents/SignUpForm.jsx";
export const revalidate = 0;
export const metadata = {
  title: "Sign-Up",
  description: "Create your account on NextGallery to start organizing and exploring your photo collection.",
};

export default function page() {
  return (
<div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-[30rem] ">
        <SignUpForm />
      </Card>
    </div>
  );
}
