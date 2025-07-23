import LoginForm from "../_MyComponents/LoginForm";
export const metadata = {
  title: "Login",
  description: "Log in to your NextGallery account to access your albums, memories, and photo collections.",
};

function page() {
   return (
     <div className="flex justify-center items-center h-screen">
        <LoginForm />
     </div>
   );
}

export default page
