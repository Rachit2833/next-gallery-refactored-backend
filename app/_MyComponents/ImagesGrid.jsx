import { cookies } from "next/headers";
import PasteCards from "./AlbumsComponent/PasteCards";
import NoImagesDoodle from "./NoImagesDoodle";
import { PagePagination } from "./Pagination";
import ImageWrapper from "./ImageWrapper";

async function ImagesGrid({ searchParams }) {
  const { year, cod, frId, query, page, limit,sort } = searchParams || {};
  const params = new URLSearchParams();

  if (year) params.append("year", year);
  if (cod) params.append("cod", cod);
  if (frId) params.append("frId", frId);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);
  console.log(sort, "sort in ImagesGrid");

  const queryString = params.toString();
  const cookieStore = await cookies();

  const url = `http://localhost:2833/image${queryString ? `?${queryString}` : ""}`;
  let res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session")?.value || ""}`,
    },
  });

  res = await res.json();

  return (
    <>
      {res?.images?.length > 0 ? (
        <>
          <ImageWrapper left={res?.leftPage} res={res?.images} cod={cod} />
          {/* <PasteCards query={query} res={res?.images} cod={cod} frId={frId} /> */}
        </>
      ) : (
        <NoImagesDoodle />
      )}
      <PagePagination totalPagesLeft={res.leftPage} />
    </>
  );
}

export default ImagesGrid;
