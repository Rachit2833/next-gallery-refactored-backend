"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getImageBlurred } from "../_lib/utils"
import { CloudCog } from "lucide-react";
// const cookieStore = await cookies();

export async function updateName(formData) {
  const cookieStore = await cookies();
  const name = formData.get("labelName");
  const id = formData.get("id");
  try {
    const res = await fetch(`http://localhost:2833/label/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ label: name }),
    });
    revalidatePath("/people")
  } catch (error) {
    console.error(error);
  }
}
export async function updateImageForLabel(formData) {
  console.log(formData)
  const cookieStore = await cookies();
  const labelId = formData.get("labelId");
  const ImageUrl = formData.get("imageUrl");
  console.log(labelId, ImageUrl)
  try {
    const res = await fetch(`http://localhost:2833/label/${labelId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ ImageUrl }),
    });
    revalidatePath("/people")
    console.log(res)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error);
  }
}
export async function deleteImagesAction(formData) {
  const cookieStore = await cookies();
  const imageId = formData.get("imageId");
  try {
    const res = await fetch(`http://localhost:2833/image?img_id=${imageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
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
  const cookieStore = await cookies();
  try {
    const Name = String(formData.get("Title") ?? "");
    const Description = String(formData.get("Description") ?? "");
    const photo = formData.get("photo"); // This is already a File object
    const formDataToSend = new FormData();
    formDataToSend.append("Name", Name);
    formDataToSend.append("Description", Description);
    if(photo.size > 0) {
      formDataToSend.append("images", photo);
    }
    console.log(formDataToSend,"njdcfe");

    const res = await fetch("http://localhost:2833/album", {
      method: "POST",
      headers: {
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: formDataToSend, // Send as FormData
    });

    const data = await res.json();
    revalidatePath("/albums");
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to Create Album: ${error.message}`);
  }
}
export async function saveSharedAlbum(dataX) {
  const cookieStore = await cookies();

  try {
    const res = await fetch("http://localhost:2833/album/share/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session")?.value}`,
      },
      body: JSON.stringify(dataX),
    });

    // Check if the response is not okay
    if (!res.ok) {
      const errorData = await res.json(); // Try extracting error message
      throw new Error(
        errorData?.message || `HTTP error! Status: ${res.status}`
      );
    }

    const data = await res.json();
    console.log(data, "hello");
    revalidatePath("/albums");

    return data;
  } catch (error) {
    console.error("Save album failed:", error);
    throw new Error(`Failed to Create Album: ${error.message}`);
  }
}


export async function deleteAlbumAction(formData) {
  const cookieStore = await cookies();
  const id = formData.get("albumId");
  console.log(id);
  try {
    const data = await fetch(`http://localhost:2833/album/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
    });
    revalidatePath("/albums");
  } catch (error) {
    throw new Error(`Failed to delete Album `);
  }
}
export async function updateFavourite(formData) {
  const cookieStore = await cookies();
  const id = formData.get("imageId");
  const favValue = formData.get("favValue") === "true"; // Ensures boolean conversion
  try {
    const data = await fetch(`http://localhost:2833/image/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ Favourite: !favValue }), // Negating correctly
    });
    const response = await data.json();

    // Check if the request was successful
    if (!data.ok) {
      console.log(response, "data");
      throw new Error("Failed to update favourite");
    }

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update favourite");
  }
}
export async function saveNewImage(formData, id) {
  const cookieStore = await cookies();
  console.log("hello,", formData);

  // Parse the people array from formData
  const peoples = JSON.parse(formData.get("People"));
  console.log("Parsed People:", peoples); // Just for debugging

  // Prepare a new FormData to send to backend
  const data = new FormData();

  // Append image
  data.append("images", formData.get("photo"));

  // Append string fields
  data.append("LocationName", formData.get("LocationName"));
  data.append("Description", "hello world");
  data.append("Favourite", "false"); // must be string for consistent parsing
  data.append("Country", formData.get("Country"));
  data.append("detection", formData.get("detection"))
  data.append("People", JSON.stringify(peoples));

  try {
    const res = await fetch("http://localhost:2833/image/mass", {
      headers: {
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      method: "POST",
      body: data,
    });
    const val = await res.json();
    revalidatePath("/");
    revalidatePath("/memory-map");

    return val;
  } catch (error) {
    console.error("Upload failed:", error);
    return { error: "Upload failed" };
  }
}

//  let des = await autoSend(id,val.data.People)
//  console.log(des);
//  const inp = await fetch("http://localhost:2833/image/share", {
//    method: "POST",
//    headers: {
//      "Content-Type": "application/json",
//      authorization: `Bearer ${cookieStore.get("session").value}`,
//    },
//    body: JSON.stringify({ imgId:val.data._id, sharedIds: des }),
//  });

export async function getLocationInfo(formData) {
  const cookieStore = await cookies();
  const lat = formData.get("latitude");
  const long = formData.get("longitude");
  const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`);
  if (res.ok) {
    const data = await res.json(); // Parse JSON data
    const newdata = {
      lat: data.latitude,
      long: data.longitude,
      city: data.city,
      country: data.countryName,
      principalSubdivision: data.principalSubdivision,
    };
    return newdata
  } else {
    console.error("Failed to fetch data", res.status);
  }
}
export async function handleSubmitMessage(formData) {
  const cookieStore = await cookies();

  try {
    const messageData = Object.fromEntries(formData.entries());
    const response = await fetch("http://localhost:2833/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session")?.value || ""}`, // Handle missing session cookie
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

export async function handleLoginTemporary(formData) {
  const cookieStore = await cookies();
  try {
    const userId = formData.get("id")
    if (userId) {
      const response = await fetch("http://localhost:2833/login", {
        method: "POST", // Corrected method case
        headers: {
          "Content-Type": "application/json", // Added headers to specify JSON format
        },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });

    }
  } catch (error) {
    console.error(error);
  }
}
export async function addGroup(formData, selectedUser, userId) {
  const cookieStore = await cookies();
  try {

    selectedUser.forEach((userId) => {
      formData.append("people", userId);
    });
    const response = await fetch(
      `http://localhost:2833/message/group?_id=${userId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create group");
    }

    revalidatePath("/friends");
  } catch (error) {
    console.error("Error adding group:", error);
  }
}




export async function sendGroupMessage(groupId, senderId, formData) {
  const cookieStore = await cookies();
  const obj = {
    senderId,
    receiverId: groupId._id,
    content: formData.get("content"),
  };
  const res = await fetch("http://localhost:2833/message/group/message", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  });
  const data = await res.json()
  return data.newGroupMessage;
}

export async function handleGroupLeave(userId, groupId, isAdmin) {
  const cookieStore = await cookies();
  try {
    const obj1 = {
      removeUser: [userId]
    };

    const response = await fetch(`http://localhost:2833/message/group?groupId=${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(obj1),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to leave the group");
    }
    const data = await response.json();
    revalidatePath("/friends");
    return data.updatedGroup;
  } catch (error) {
    console.error(error);
  }
}
export async function removeUser(removePeople, groupId) {
  try {
    const obj1 = {
      removeUser: removePeople,
    };

    const response = await fetch(
      `http://localhost:2833/message/group?groupId=${groupId}`,
      {
        method: "PATCH",
        body: JSON.stringify(obj1),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed toremove the user");
    }
    const data = await response.json();
    revalidatePath("/friends");

    return data.updatedGroup;
  } catch (error) {
    console.error(error);
  }
}
export async function autoSend(id, friendId) {
  try {
    console.log(id, "auto Send id");
    const response = await fetch(
      `http://localhost:2833/friends/verify?id=${id}&friendId=${friendId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!data) {
      console.warn("No data received from the server");
      return null;
    }
    let descriptorId = [];
    console.log(data.data, "data.data");
    data.data.forEach((item, i) => {
      if (item.userId === id && item.autoSend?.userId?.enabled) {
        descriptorId.push(item.friendId)
      } else if (item.autoSend?.friendId?.enabled) {
        descriptorId.push(item.userId)
      }
    })
    return descriptorId
  } catch (error) {
    console.error("Error in autoSend:", error);
    return null;
  }
}


export async function addUser(addPeople, groupId) {
  const cookieStore = await cookies();
  try {
    const obj1 = {
      addUser: addPeople,
    };
    const response = await fetch(
      `http://localhost:2833/message/group?groupId=${groupId}`,
      {
        method: "PATCH",
        body: JSON.stringify(obj1),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add the user to group");
    }
    const data = await response.json();
    revalidatePath("/friends");
    return data.updatedGroup;
  } catch (error) {
    console.error(error);
  }
}

export async function handleGroupEdit(formData, groupId) {
  const cookieStore = await cookies();
  const updatePayload = {};
  const name = formData.get("name");
  const description = formData.get("description");

  if (name) {
    updatePayload.changeName = name;
  }
  if (description) {
    updatePayload.changeDescription = description;
  }
  try {
    const apiBaseUrl = "http://localhost:2833";
    const response = await fetch(
      `${apiBaseUrl}/message/group?groupId=${groupId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      }
    );
    const data = await response.json();


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to edit group details: ${response.status} - ${errorText}`
      );
    }


    revalidatePath("/friends");

    return data.updatedGroup;
  } catch (error) {
    console.error("Error in handleGroupEdit:", error);
    return { error: error.message };
  }
}

export async function loginUser(formData) {
  try {
    const response = await fetch("http://localhost:2833/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }

    const data = await response.json();
    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // 7 days
    const cookieStore = cookies();
    cookieStore.set("session", data.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires,
    });
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
export async function signUpUser(formData) {
  const cookieStore = await cookies();
  try {
    const response = await fetch("http://localhost:2833/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }

    const data = await response.json();

    // Set expiration time (convert days to milliseconds)
    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // 7 days

    // Store cookie manually in Next.js
    const cookieStore = cookies();
    cookieStore.set("session", data.token, {
      path: "/",
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict", // Prevents CSRF attacks
      expires, // Expiration date
    });

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
export async function logOutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
export async function changeLabel(id, label, idBit, enabled) {
  try {
    const cookieStore = await cookies();
    const response = await fetch(
      `http://localhost:2833/friends/autoSend?relationId=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookieStore.get("session").value}`,
        },
        body: JSON.stringify({ descriptorID: label, idBit, enabled }),
        credentials: "include",
      }
    );
    revalidatePath("/friends");
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
export async function toggleAutoSend(id, enabled, idBit) {

  try {
    const cookieStore = await cookies();
    const response = await fetch(
      `http://localhost:2833/friends/autoSend?relationId=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookieStore.get("session").value}`,
        },
        body: JSON.stringify({ enabled, idBit }),
        credentials: "include",
      }
    );
    revalidatePath("/friends");
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteSharedImages(id, userId) {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`http://localhost:2833/image/share?id=${id}&sharedId=${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${cookieStore.get("session").value}`,
        },
        credentials: "include",
      }
    );
    revalidatePath("/");
    if (!response.ok) {
      console.log(response, "response");
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function deleteManyImages(idArray) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`http://localhost:2833/image/all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ idArray }),
    });
    const data = await res.json()
    console.log(data, "ghjgj");

    if (!res.ok) {

      throw new Error(`Failed to delete image with status ${res.status}`);
    }
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}
export async function generateShareLink(sharedById, imgIds) {
  try {
    console.log(sharedById, imgIds);
    const cookieStore = await cookies();
    const response = await fetch("http://localhost:2833/image/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ imgIds}),
    });
    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
    const data = await response.json();

    return data.link;
  } catch (error) {
    console.error(error);
  }
}
export async function saveLinkImages(ids, userid) {
  try {
    console.log(userid);
    if (ids.length === 0) return
    const cookieStore = await cookies();
    const res = await fetch("http://localhost:2833/image/share/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ ids, sharedById: userid }),
    });
    if (!res.ok) {
      throw new Error(data?.message || "Failed to save images");
    }
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error

  }
}
export async function addImagesToAlbum(id, photoArray) {
  const cookieStore = await cookies()
  try {
    const res = await fetch(`http://localhost:2833/album/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ photoArray }),
    });
    if (!res.ok) {
      console.log(res, ":res");
      throw new Error(`Failed to sign up: ${res.statusText}`);
    }
    const data = await res.json()
    console.log(data, ":data");
    return data
  } catch (error) {
    console.error(error);
  }
}
export async function generateShareLinkAlbum(albumId, shareById) {
  try {
    console.log(123)
    const cookieStore = await cookies();
    const response = await fetch("http://localhost:2833/album/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ albumId, shareById }),
    });
    if (!response.ok) {
      throw new Error(`Failed to sign up: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data, "data");
    const url = `http://localhost:3000/share?id=${data.data._id}&sharedId=${shareById}&type=album`;
    return url;
  } catch (error) {
    console.error(error);
  }

}
export async function generateGroupInvite(inviteId, shareById) {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`http://localhost:2833/message/group/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
      },
      body: JSON.stringify({ inviteId, shareById }),
    });
    if (!res.ok) {
      throw new Error(`Failed to sign up: ${res.statusText}`);
    }
    const data = await res.json()
    const url = `http://localhost:3000/friends?inviteId=${data.data._id}&sharedId=${shareById}&type=invite`;
    return url
  } catch (error) {
    console.error(error);
  }
}
export async function saveMassImages(formData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    console.log(formData);
    const res = await fetch("http://localhost:2833/image/mass", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        // 🚫 DO NOT manually set Content-Type for FormData
      },
      body: formData,
    });
    const data = await res.json()
    console.log(data, "hejhrweo");

    if (!res.ok) {
      const errText = await res.text();
      console.error("Server response:", errText);
      throw new Error(`Upload failed: ${res.statusText}`);
    }


    console.log("Upload successful");
  } catch (error) {
    console.error("Upload error:", error.message);
  }
}
export async function updateImage(formData) {
  try {
    const cookieStore = await cookies();
    const id = formData.get("id");
    const formType = formData.get("FormType");
    const token = cookieStore.get("session")?.value; // or wherever you're storing it

    let res;

    if (formType === "1") {
      // Send JSON data
      res = await fetch(`http://localhost:2833/user/avatarUpdate/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ImageName: formData.get("ImageName"),
        }),
      });
    } else {
      // Send form data directly
      res = await fetch(`http://localhost:2833/user/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });
    }
    if (!res.ok) {
      console.error("Update failed:", error);
      throw error;
    }
    const data = await res.json();
    revalidatePath("/setting");
    return data;
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
}
