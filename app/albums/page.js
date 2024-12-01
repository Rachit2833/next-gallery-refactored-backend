
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ListFilter } from "lucide-react";
import AlbumCard from "../_MyComponents/AlbumsComponent/AlbumCard";
import DrawerClick from "../_MyComponents/DrawerClick";
import { Suspense } from "react";
import AlbumGrid from "../_MyComponents/AlbumsComponent/AlbumGrid";
import AlbumLoaders from "../_MyComponents/Loaders/AlbumLoaders";
import AlbumFilter from "../_MyComponents/AlbumsComponent/AlbumFilter";
import AddAlbumForm from "../_MyComponents/AlbumsComponent/AddAlbumForm";

 async function page({searchParams}) {
  const query = await searchParams
   return (
     <>
          <Suspense fallback={<AlbumLoaders />}>
                <AlbumGrid year={query.year} />
          </Suspense>
     

     </>
   );
}

export default page
