import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware executed");
  const token = req.cookies.get("session")?.value; 
  const { pathname } = req.nextUrl;
  if(!token && (pathname==="/login"||pathname==="/sign-up")){
    return NextResponse.next()
  }
  if (!token) {
    console.log("No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const authResponse = await fetch("http://localhost:2833/user/verify-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Manually attach token
      },
    });

    if (!authResponse.ok) {
      console.log("Invalid token, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const data = await authResponse.json();
    console.log("Token Verified:", data);
    if(pathname==="/sign-up"||pathname==="/login"&& token){
      return NextResponse.redirect(new URL("/", req.url));

    }
    return NextResponse.next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware to all routes except login and sign-up
export const config = {
  matcher: [
    "/",
    "/albums",
    "/friends",
    "/people",
    "/favourites",
    "/memory-map",
    "/post",
    "/sign-up",
    "/login"
  ], // Apply to all routes
};
