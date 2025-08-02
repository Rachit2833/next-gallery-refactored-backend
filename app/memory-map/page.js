import { cookies } from "next/headers";
import MapSideImages from "../_MyComponents/MapComponents/MapSideImages";
import MapSideOption from "../_MyComponents/MapComponents/MapSideOption";
import MapWrapper from "../_MyComponents/MapComponents/MapWrapper";

export const metadata = {
  title: "Memory Map",
  description: "Explore your memories on an interactive map, organized by location and travel history.",
};

export default async function page({searchParams}) {
  const cookieStore = await cookies();
  let searchURLParams = await searchParams;
  const res = await fetch(
    `http://localhost:2833/image/location?yearRange=${searchURLParams.yearRange}`,
    {
  
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
