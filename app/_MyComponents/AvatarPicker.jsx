"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { avatarImages } from "../_lib/avatar";

const AvatarPicker = ({ current,selected, setSelected }) => {


  useEffect(() => {
    setSelected(current ?? null);
  }, [current]);

  const selectedImage = (() => {
    if (!selected) return "/avatar.jpg";
    const index = Number(selected);
    if (!isNaN(index) && avatarImages[index]) return avatarImages[index];
    return selected; // treat as custom image URL
  })();

  const isCustomImage = selected && isNaN(Number(selected));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Selected Avatar Preview */}
      <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border">
        <Image
          src={selectedImage}
          width={112}
          height={112}
          alt="Selected Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {avatarImages.map((url, i) => {
          const isSelected = selected === String(i);
          return (
            <div
              key={i}
              onClick={() => setSelected(String(i))}
              className={`w-14 h-14 rounded-full overflow-hidden shadow-md cursor-pointer 
                ${isSelected ? "border-2 border-blue-500 p-[2px]" : "border border-transparent"}`}
            >
              <Image
                src={url}
                width={56}
                height={56}
                alt={`Avatar ${i}`}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          );
        })}

        {/* Custom image preview as last option (if it's a URL) */}
   
          <div
            onClick={() => setSelected(current)}
            className={`w-14 h-14 rounded-full overflow-hidden shadow-md cursor-pointer 
               border-2 border-yellow-500 p-[2px]"`}
          >
            <Image
              src={current}
              width={56}
              height={56}
              alt="Custom Avatar"
              className="object-cover w-full h-full rounded-full"
            />
          </div>

      </div>
    </div>
  );
};

export default AvatarPicker;
