"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import { Download, ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../_lib/context";
import DrawerClick from "./DrawerClick";
import Filter from "./Filter";
import RefreshButton from "./RefreshButton";

function SideFilterLayout({ year, text, formType }) {
  const router = useRouter();
  const { toast } = useToast();
  const { selectedImages, setSelectedImages, isDark, setIsDark } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleSortChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filterArray = [
    { label: "All", value: "All" },
    { label: "2024", value: 2024 },
    { label: "2023", value: 2023 },
    { label: "2022", value: 2022 },
  ];

  const handleDownload = async () => {
    if (selectedImages.length <= 0) {
      toast({
        title: "No Images Selected",
        description: "Please select Images to Download",
      });
      return;
    }

    toast({
      title: "Preparing download...",
      description: "Your download will start shortly.",
    });

    selectedImages.forEach((item) => {
      try {
        saveAs(item?.url, Date.now().toString());
        toast({
          title: "Download started!",
          description: "Your file is being downloaded.",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was an error starting your download.",
        });
      }
    });
  };

  return (
    <div className=" sm:flex  items-center">
      {pathname !== "/memory-map" && pathname !== "/post" && (
        <>
          <Filter
            paramName="year"
            values={filterArray}
            defaultValue="All"
            year={year}
          />
          <div className="ml-auto flex mt-6 sm:mt-0 justify-evenly  sm:items-center gap-2">
            {/* Dark/Light Mode Toggle */}
        

            <RefreshButton />

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                  checked={searchParams.get("sort") === "_id"}
                  onClick={() => handleSortChange("_id")}
                >
                  Oldest to Newest
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={
                    searchParams.get("sort") === "-_id" ||
                    searchParams.get("sort") === null
                  }
                  onClick={() => handleSortChange("-_id")}
                >
                  Newest to Oldest
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              size="sm"
              variant="outline"
              className="h-7 gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Download
              </span>
            </Button>

            {/* Add Form Button */}
          {!pathname.startsWith('/albums/') && <DrawerClick name={text} formType={formType} />}
          </div>
        </>
      )}
    </div>
  );
}

export default SideFilterLayout;
