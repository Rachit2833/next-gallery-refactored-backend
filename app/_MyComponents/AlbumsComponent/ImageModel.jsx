"use client";

import { useUser } from "@/app/_lib/context";
import image1 from "@/public/Images/dune.jpg";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

// 🧠 Alt text generator utility


function ImageModel() {
  const abc =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII=";

  const {
    modelType,
    isImageOpen,
    setIsImageOpen,
    modelImages,
    setModelImages,
    fetchedImages,
    imageLeft,
    personalDetails, // ⬅️ make sure this is in context
  } = useUser();

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(params.get("page") || "1");

  const imageNum = fetchedImages?.findIndex(
    (img) => img._id === modelImages?._id
  );


  const handleParams = (paramName, filter) => {
    const param = new URLSearchParams(params.toString());
    param.set(paramName, filter.toString());
    router.replace(`${pathname}?${param.toString()}`, { scroll: false });
  };

  const handleNext = () => {
    if (imageNum !== fetchedImages.length - 1) {
      setModelImages(fetchedImages[imageNum + 1]);
    } else if (imageLeft > 0) {
      handleParams("page", page + 1);
    }
  };

  const handlePrevious = () => {
    if (imageNum > 0) {
      setModelImages(fetchedImages[imageNum - 1]);
    } else if (page >= 2) {
      handleParams("page", page - 1);
    }
  };

  if (!isImageOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="relative w-[80%] h-[80%] bg-white rounded-lg shadow-lg overflow-hidden">
        <Button
          onClick={() => setIsImageOpen(false)}
          variant="outline"
          className="absolute top-4 right-4 z-10"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>

        {modelType === 1 && (
          <>
            <Button
              onClick={handleNext}
              variant="outline"
              className="absolute bottom-1/2 right-4 z-10"
              disabled={
                imageNum === fetchedImages.length - 1 && imageLeft === 0
              }
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={handlePrevious}
              variant="outline"
              className="absolute bottom-1/2 left-4 z-10"
              disabled={imageNum === 0 && page < 2}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {imageNum >= 0 && (
              <div className="flex gap-2 text-white font-bold w-36 bg-black/50 h-12 rounded-lg justify-center items-center absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <span>{imageNum + 1}</span>
                <span>/</span>
                <span>{fetchedImages?.length}</span>
              </div>
            )}
          </>
        )}

        {/* Desktop */}
        <AspectRatio
          ratio={16 / 9}
          className="sm:block hidden relative w-full h-full"
          style={{
            backgroundImage: `url(${modelImages?.blurredImage || abc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Image
            priority
            src={modelImages?.ImageUrl || image1}
            alt={getAltText(modelImages)}
            fill
            className="rounded-lg object-contain"
            placeholder="blur"
            blurDataURL={modelImages?.blurredImage || abc}
          />
        </AspectRatio>

        {/* Mobile */}
        <AspectRatio
          ratio={1 / 8}
          className="block sm:hidden relative w-full h-full"
          style={{
            backgroundImage: `url(${modelImages?.blurredImage || abc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Image
            priority
            src={modelImages?.ImageUrl || image1}
            alt={getAltText(modelImages)}
            fill
            className="rounded-lg object-contain"
            placeholder="blur"
            blurDataURL={modelImages?.blurredImage || abc}
          />
        </AspectRatio>
      </div>
    </div>
  );
}

export default ImageModel;
