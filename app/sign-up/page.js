import {
  Card
} from "@/components/ui/card";
import SignUpForm from "../_MyComponents/SignUpForm";


function page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[30rem] ">
         <SignUpForm />
      </Card>
    </div>
  );
}

export default page;

