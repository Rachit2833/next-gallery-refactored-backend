"use server"

import { revalidatePath } from "next/cache";


export async function updateName(formData) {
  const name = formData.get("labelName");
  const id = formData.get("id");
  try {
    const res = await fetch(`http://localhost:2833/label/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label: name }),
    });
    revalidatePath("/people")
  } catch (error) {
    console.error(error);
  }
}
export async function deleteImagesAction(formData) {
  const imageId = formData.get("imageId");
  console.log(imageId);
  if (!imageId) {
    console.error("Image ID is missing");
    return;
  }

  try {
    const res = await fetch(`http://localhost:2833/image?img_id=${imageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId }), // Send imageId in the body for identification
    });

    if (!res.ok) {
      throw new Error(`Failed to delete image with status ${res.status}`);
    }
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
export async function createNewAlbum(formData) {
  try {
    const Name = formData.get("Title");
    const Description = formData.get("Description");

    const data = await fetch("http://localhost:2833/album", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name, Description }),
    });
    revalidatePath("/albums");
  } catch (error) {
    console.error(error);
     throw new Error(`Failed to Create Album`,error.message);
  }
}
export async function deleteAlbumAction(formData) {
  const id = formData.get("albumId");
  try {
    const data = await fetch(`http://localhost:2833/album/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    revalidatePath("/albums");
  } catch (error) {
    throw new Error(`Failed to delete Album `);
  }
}