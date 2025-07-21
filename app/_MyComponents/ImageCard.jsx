"use client";
import img from "@/app/dune.jpg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { saveAs } from "file-saver";
import { Check, CheckIcon, MoveRight, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteImagesAction,
  updateImageForLabel,
} from "../_lib/actions";
import { useUser } from "../_lib/context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

function logTimeDifference(dateString) {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffMillis = now - pastDate;
  const diffSeconds = Math.floor(diffMillis / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1 || diffDays === 0) return "Added recently";
  else if (diffDays === 1) return "Added yesterday";
  else return `Added ${diffDays} days ago`;
}

function ImageCard({ image, text, editSelection, name, toggleFav }) {
  const abc =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII=";

  const cardRef = useRef(null);
  const currentPath = usePathname();
  const {
    setIsImageOpen,
    modelImages,
    setModelImages,
    selectedImages,
    setSelectedImages,
    isTest,
    setIsTest,
    handleDownload
    
  } = useUser();

  const isSelected = selectedImages.some(
    (item) => item.id === image?._id
  );

  function onSelect() {
    if (isSelected) {
      const img = selectedImages.filter(
        (item) => item.id !== image?._id
      );
      setSelectedImages(img);
    } else {
      setSelectedImages([
        ...selectedImages,
        {
          id: image?._id,
          url: image?.ImageUrl,
        },
      ]);
    }
  }

  

  return (
    <div
      onClick={() => {
        setIsTest(image?._id);
      }}
      onDragStart={() => {
        setIsTest(image?._id);
      }}
      onDoubleClick={onSelect}
      ref={cardRef}
      className={`transition-colors duration-100 ease-in-out mx-auto relative ${
        image?.Favourite ? "bg-[#e3d380]" : "bg-white"
      } ${
        isSelected ? "border-[#4169e1] border-4" : ""
      } rounded-lg shadow-md p-4 w-full max-w-xs lg:max-w-sm`}
    >
      {isSelected && (
        <Button
          className="absolute top-[-1rem] rounded-full h-8 w-8 p-0 m-0 bg-white border-[#4169e1] text-[#4169e1] border-4 text-black z-10 font-[2rem] hover:bg-white right-[-1rem]"
        >
          <CheckIcon />
        </Button>
      )}

      <div
        style={{
          backgroundImage: `url(${image.blurredImage || abc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative select-none w-full lg:h-[15rem] sm:h-[12rem] h-[8rem] rounded-t-lg cursor-pointer overflow-hidden"
        onClick={() => {
          setIsImageOpen(true);
          setModelImages(image);
        }}
      >
        <Image
          src={
            image?.ImageUrl === "https://example.com/image1.jpg" ||
            !image?.ImageUrl
              ? img
              : image?.ImageUrl
          }
          alt="Placeholder"
          fill
          objectFit="contain"
          className="rounded-t-lg"
          quality={10}
          loading="lazy"
          placeholder="blur"
          blurDataURL={image.blurredImage || abc}
        />
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-y-auto max-h-24 mt-2">
            <CardDescription>{image?.Location?.name}</CardDescription>
            <p className="heading">{image?.Description}</p>
            <div className="text-xs text-gray-500 mt-4 sm:block hidden">
              <p>
                By{" "}
                <span className="font-semibold hover:cursor-pointer">
                  Author Name
                </span>{" "}
                {logTimeDifference("2024-09-29T10:00:00")}
              </p>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={()=>handleDownload(image?.ImageUrl)}>
            Download
          </ContextMenuItem>

          {editSelection && (
            <AlertDialog>
              <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent w-full">
                Set to Cover Image
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    This image will be set as the person’s cover image
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will affect the profile of the person
                    across the entire application.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-center justify-between px-4 py-4 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                      {name?.label || "Unnamed"}
                    </span>
                  </div>
                  <MoveRight className="text-gray-400" />
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 relative w-12">
                      <Image
                        priority
                        fill
                        src={image.ImageUrl}
                        placeholder={image.blurredImage}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <span className="text-sm text-primary font-medium truncate max-w-[150px]">
                      {name?.label || "Unnamed"}
                    </span>
                  </div>
                </div>

                <AlertDialogFooter>
                  <form action={updateImageForLabel}>
                    <input
                      type="hidden"
                      value={name?._id}
                      name="labelId"
                    />
                    <input
                      type="hidden"
                      value={image.ImageUrl}
                      name="imageUrl"
                    />
                    <AlertDialogCancel className="mx-2">
                      Cancel
                    </AlertDialogCancel>
                    <Deletebutton />
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <ContextMenuItem>Share</ContextMenuItem>

          <AlertDialog>
            <AlertDialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent w-full">
              {`/${currentPath.split("/")[1]}` === "/albums"
                ? "Remove From Album"
                : "Delete"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently
                  delete this Image from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <form action={deleteImagesAction}>
                  <input
                    type="hidden"
                    value={image?._id}
                    name="imageId"
                  />
                  <AlertDialogCancel className=" mx-2">
                    Cancel
                  </AlertDialogCancel>
                  <Deletebutton />
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <form action={(formData) => toggleFav(formData, "favorite")}>
            <input
              type="hidden"
              value={image?._id}
              name="imageId"
            />
            <input
              type="hidden"
              value={image?.Favourite}
              name="favValue"
            />
            <ContextMenuItem>
              <button
                className="flex justify-end align-middle"
                type="submit"
              >
                Favourite{" "}
                {image?.Favourite ? (
                  <span className="ml-4">
                    <Check />
                  </span>
                ) : null}
              </button>
            </ContextMenuItem>
          </form>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export default ImageCard;

export function Deletebutton({ text }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {text || "Continue"}
    </Button>
  );
}
