import Wrapper from "./_MyComponents/Wrapper";
import ImagesGrid from "./_MyComponents/ImagesGrid";
import AlbumList from "./_MyComponents/SearchComponents/AlbumList";


export default async function page({ searchParams }) {
  const params = await searchParams
  return (
    <Wrapper
      params={params}
      alc={<AlbumList />}
      card={<ImagesGrid searchParams={params} />}
    />
  );
}
