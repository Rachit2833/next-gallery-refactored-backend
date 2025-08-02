import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import CountryCard from "./CountryCard";
import { Countries } from "@/app/_lib/countries";
import Paris from "./paris.jpg";
import { cookies } from "next/headers";

function getCountryCodeByName(countryName) {
  const entries = Object.entries(Countries);
  const found = entries.find(([, name]) => name === countryName);
  return found ? found[0] : null;
}

async function MapSideOption({ year, yearRange }) {
  const cookieStore = await cookies();
  const data = await fetch(
    `http://localhost:2833/stats/countries?year=${year}&yearRange=${yearRange}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
    }
  );
  const resData = await data.json();

  const favouriteCountry = resData.favouriteCountry[0]._id;
  const favouriteLocation = resData.favouriteLocation[0]._id.locationName;
  const favCode = getCountryCodeByName(favouriteCountry);

  return (
    <div className="my-4 grid gap-4 h-[70vh] max-h-[80vh] overflow-y-auto px-2 sm:px-4">
      {/* Countries Visited */}
      <Card>
        <CardHeader>
          <CardTitle>
            {resData.AllCountries[0].countries.length} Countries Visited in Previous{" "}
            {yearRange === "All"
              ? "years"
              : yearRange === 1
              ? `${year} year`
              : `${year} years`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountryCard data={resData.AllCountries} />
        </CardContent>
      </Card>

      {/* Favourite Country */}
      <Card>
        <CardHeader>
          <CardTitle>
            {resData.favouriteCountry[0].numImages} Photos Clicked In Previous 1 year
          </CardTitle>
          <CardDescription>
            with <strong>{favouriteCountry}</strong> Being Your Favourite Country
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32 w-full relative">
            <Image
              src={`https://flagcdn.com/h240/${favCode}.png`}
              alt={`${favouriteCountry} Flag`}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </CardContent>
      </Card>

      {/* Favourite Location */}
      <Card>
        <CardHeader>
          <CardTitle>{favouriteLocation}</CardTitle>
          <CardDescription>was your favourite Destination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-lg overflow-hidden">
            <Image
              src={Paris}
              fill
              alt="Paris, Eiffel Tower"
              className="object-cover rounded-md"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <h1 className="absolute bottom-2 left-4 text-white text-lg sm:text-xl font-bold drop-shadow-md">
              {favouriteLocation.split(",")[0]}
            </h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MapSideOption;
