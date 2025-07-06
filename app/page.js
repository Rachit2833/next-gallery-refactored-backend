
import Wrapper from "./_MyComponents/Wrapper";
import ImagesGrid from "./_MyComponents/ImagesGrid";
import { cookies } from "next/headers";
import AlbumList from "./_MyComponents/SearchComponents/AlbumList";




export const description =
  "An products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export default async function page({searchParams}) {
   let searchFilter= await searchParams
  const cookieStore= await cookies()
  const sessionToken= cookieStore.get("session").value;
  const verifyUserResponse = await fetch(
    "http://localhost:2833/user/verify-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const decodedValue = await verifyUserResponse.json();
  return (
    <Wrapper
      val={decodedValue}
      alc={<AlbumList />}
      searchYear={searchFilter.year}
      card={
        <ImagesGrid
          val={decodedValue}
          page={searchFilter.page}
          limit={searchFilter.limit}
          query={searchFilter.query}
          year={searchFilter.year}
          cod={searchFilter.cod}
          frId={searchFilter.frId}
        />
      }
    />
  );
}
