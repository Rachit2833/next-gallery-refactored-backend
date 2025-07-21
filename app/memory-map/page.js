import { cookies } from "next/headers";
import MapSideImages from "../_MyComponents/MapComponents/MapSideImages";
import MapSideOption from "../_MyComponents/MapComponents/MapSideOption";
import MapWrapper from "../_MyComponents/MapComponents/MapWrapper";

export const revalidate = 0;
export default async function page({searchParams}) {
  const cookieStore = await cookies();
  let searchURLParams = await searchParams;
  const res = await fetch(
    `https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image/location?yearRange=${searchURLParams.yearRange}`,
    {
        next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
    }
  );
  const Location = await res.json();
  return (
    <>
      <MapWrapper
        param={searchURLParams}
        Location={Location}
        sideField={<MapSideOption year={searchURLParams.yearRange} />}
        imageCard={<MapSideImages search={searchURLParams.cod} />}
      />
    </>
  );
}
