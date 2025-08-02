"use client";

import { useUser } from "@/app/_lib/context";
import image1 from "@/public/Images/dune.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function ImageModel() {
  const abc =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AAwNOwENPwEAMQQDNwD+///L2eTO2ub+//8A/v395ejt5enu/v39Q/QXhr/juNAAAAAASUVORK5CYII=";

  const {
    getAltText,
    modelType,
    isImageOpen,
    setIsImageOpen,
    modelImages,
    setModelImages,
    fetchedImages,
    imageLeft,
    personalDetails,
  } = useUser();

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(params.get("page") || "1");

  const imageNum = fetchedImages?.findIndex(
    (img) => img._id === modelImages?._id
  );

  const handleParams = (paramName, value) => {
    const param = new URLSearchParams(params.toString());
    param.set(paramName, value.toString());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-lg overflow-hidden flex items-center justify-center">
        <div
          className="relative w-full h-auto aspect-video bg-cover bg-center"
          style={{
            backgroundImage: `url(${modelImages?.blurredImage || abc})`,
          }}
        >
          {/* Image */}
          <Image
            priority
            src={modelImages?.ImageUrl || image1}
            alt={getAltText(modelImages, personalDetails)}
            fill
            className="rounded-lg object-contain"
            placeholder="blur"
            blurDataURL={modelImages?.blurredImage || abc}
          />

          {/* Close Button */}
          <Button
            onClick={() => setIsImageOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 h-8 w-8 p-1 bg-black/60 text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </Button>

          {modelType === 1 && (
            <>
              {/* Next */}
              <Button
                onClick={handleNext}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2 z-10 h-8 w-8 p-1 bg-black/60 text-white hover:bg-black/80"
                disabled={
                  imageNum === fetchedImages.length - 1 && imageLeft === 0
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Previous */}
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-3 -translate-y-1/2 z-10 h-8 w-8 p-1 bg-black/60 text-white hover:bg-black/80"
                disabled={imageNum === 0 && page < 2}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Counter */}
              {imageNum >= 0 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <span>{imageNum + 1}</span>
                  <span>/</span>
                  <span>{fetchedImages?.length}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageModel;
