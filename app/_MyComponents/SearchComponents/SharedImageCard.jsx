"use client";
import img from "@/public/Images/dune.jpg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Check, CheckIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteSharedImages } from "@/app/_lib/actions";
import { useUser } from "@/app/_lib/context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const defaultBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII=";

function logTimeDifference(dateString) {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffMillis = now - pastDate;
  const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Added recently";
  if (diffDays === 1) return "Added yesterday";
  return `Added ${diffDays} days ago`;
}

function SharedImageCard({ sharedData, image, toggleFav }) {
  const cardRef = useRef(null);
  const currentPath = usePathname();
  const {
    setIsImageOpen,
    setModelImages,
    selectedImages,
    setSelectedImages,
    setIsTest,
    handleDownload,
    personalDetails,
    getAltText,
  } = useUser();

  const isSelected = selectedImages.some((item) => item.id === image?._id);

  function onSelect() {
    if (isSelected) {
      const updated = selectedImages.filter((item) => item.id !== image._id);
      setSelectedImages(updated);
    } else {
      setSelectedImages([
        ...selectedImages,
        { id: image._id, url: image.ImageUrl },
      ]);
    }
  }

  return (
    <Card
      ref={cardRef}
      onDoubleClick={onSelect}
      onDragStart={() => setIsTest(image?._id)}
      className={cn(
        "transition-colors duration-100 ease-in-out mx-auto relative rounded-lg p-4 w-full max-w-xs lg:max-w-sm select-none", // disables text selection
        image?.Favourite && "bg-muted",
        isSelected ? "border-4 border-primary shadow-glow" : "shadow-soft"
      )}
    >
      {isSelected && (
        <Button
          className="absolute top-[-1rem] right-[-1rem] rounded-full h-8 w-8 p-0 bg-background text-primary border-primary border-4 z-10 hover:bg-background"
        >
          <CheckIcon />
        </Button>
      )}

      <div
        className="relative select-none w-full h-[9rem] sm:h-[12rem] lg:h-[15rem] rounded-t-lg cursor-pointer overflow-hidden"
        onClick={() => {
          setIsImageOpen(true);
          setModelImages(image);
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${image.blurredImage || defaultBlur})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(12px)",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent" />
        <Image
          src={
            image?.ImageUrl === "https://.com/image1.jpg" || !image?.ImageUrl
              ? img
              : image?.ImageUrl
          }
          alt={getAltText?.(image, personalDetails) || "Shared Image"}
          fill
          className="rounded-t-lg z-20 object-cover sm:object-contain"
          quality={10}
          loading="lazy"
          placeholder="blur"
          blurDataURL={image.blurredImage || defaultBlur}
        />
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-y-auto max-h-24 mt-2 select-none">
            <div className="flex justify-between items-center">
              <CardDescription className="select-none">
                {image?.Location?.name}
              </CardDescription>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-center select-none">{image?.Description}</p>
            <div className="text-xs text-muted-foreground mt-4 sm:block hidden select-none">
              <p>
                By{" "}
                <span className="font-semibold cursor-pointer hover:underline">
                  {image?.sharedBy?.name || "Unknown"}
                </span>{" "}
                {logTimeDifference("2024-09-29T10:00:00")}
              </p>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleDownload(image?.ImageUrl)}>
            Download
          </ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>

          <AlertDialog>
            <AlertDialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm focus:bg-accent">
              {`/${currentPath.split("/")[1]}` === "/albums"
                ? "Remove From Album"
                : "Delete"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  image from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <form
                  action={() =>
                    deleteSharedImages(sharedData, localStorage.getItem("userId"))
                  }
                >
                  <input type="hidden" name="imageId" value={image?._id} />
                  <AlertDialogCancel className="mx-2">Cancel</AlertDialogCancel>
                  <Deletebutton />
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <form action={(formData) => toggleFav(formData, "favorite")}>
            <input type="hidden" value={image?._id} name="imageId" />
            <input type="hidden" value={image?.Favourite} name="favValue" />
            <ContextMenuItem>
              <button
                className="flex items-center justify-between w-full"
                type="submit"
              >
                Favourite
                {image?.Favourite && <Check className="ml-4" />}
              </button>
            </ContextMenuItem>
          </form>
        </ContextMenuContent>
      </ContextMenu>
    </Card>
  );
}

export default SharedImageCard;

export function Deletebutton({ text }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {text || "Continue"}
    </Button>
  );
}
