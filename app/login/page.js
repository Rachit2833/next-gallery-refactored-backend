import LoginForm from "../_MyComponents/LoginForm";

export const metadata = {
  title: "Login",
  description: "Log in to your NextGallery account to access your albums, memories, and photo collections.",
};

function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <LoginForm />
    </div>
  );
}

export default Page;
