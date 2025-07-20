'use client'
import ImageCard from "./ImageCard";
import SharedImageCard from "./SearchComponents/SharedImageCard";
import SearchGrid from "./SearchGrid";
import { useUser } from "../_lib/context";
import { useEffect, useOptimistic } from "react";
import { updateFavourite } from "../_lib/actions";

function ImageWrapper({ res, cod, left }) {
  const { setFetchedImages, setImageLeft } = useUser();

  const [optimisticImages, optimisticChange] = useOptimistic(res, (prev, { bookingId, type }) => {
    if (type === "favorite") {
      return prev.map((item) =>
        item._id === bookingId ? { ...item, Favourite: !item.Favourite } : item
      );
    }
    return prev;
  });

  async function toggleFav(formData,type) {
    const id = formData.get("imageId");
    console.log(type, id, "toggleFav");
    if (!id) return;
    optimisticChange({ bookingId: id, type: "favorite" });
    await updateFavourite(formData);
  }

  useEffect(() => {
    setFetchedImages(res);
    setImageLeft(left > 0 ? left : 0);
  }, [res, left]);

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4">
      {cod ? (
        <SearchGrid />
      ) : (
        optimisticImages?.map((item) =>
          item.sharedBy ? (
            <SharedImageCard sharedData={item._id} key={item._id} image={item} />
          ) : (
            <ImageCard toggleFav={toggleFav} key={item._id} image={item} />
          )
        )
      )}
    </div>
  );
}

export default ImageWrapper;
