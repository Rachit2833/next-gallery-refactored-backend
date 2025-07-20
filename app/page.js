import Wrapper from "./_MyComponents/Wrapper";
import ImagesGrid from "./_MyComponents/ImagesGrid";
import AlbumList from "./_MyComponents/SearchComponents/AlbumList";

export const description =
  "A products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

export default async function page({ searchParams }) {
  const params = await searchParams
  return (
    <Wrapper
       page={searchParams.page || 1}
      alc={<AlbumList />}
      searchYear={params.year}
      card={<ImagesGrid searchParams={params} />}
    />
  );
}
