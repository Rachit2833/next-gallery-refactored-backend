"use server"

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
    const Name = formData.get("Title");
    const Description = formData.get("Description");

    const data = await fetch("http://localhost:2833/album", {
      method: "POST",
     headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookieStore.get("session").value}`,
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

    // Check if the request was successful
    if (!data.ok) {
      throw new Error("Failed to update favourite");
    }

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update favourite");
  }
}
export async function saveNewImage(formData) {
  const cookieStore = await cookies();
    const peoples = JSON.parse(formData.get("People"));
    const data= new FormData()
    data.append('photo',formData.get("photo"))
    data.append("Location",JSON.stringify({ name: formData.get("LocationName"), coordinates: [48.8575, 2.3514] }));
    data.append('Description',"hello world")
    data.append('Favourite',false)
    data.append("Country",formData.get("Country"));
peoples.forEach((person) => {
  data.append("People", person);
});
   try {
     const res = await fetch("http://localhost:2833/image/", {
       method: "POST",
       body:data
     });
     revalidatePath("/");
     revalidatePath("/memory-map");
   } catch (error) {
     console.error(error);
   }

}
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
      const userId= formData.get("id")
      if(userId){
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




export async function sendGroupMessage(groupId ,senderId,formData) {
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

export async function handleGroupLeave(userId,groupId,isAdmin) {
  const cookieStore = await cookies();
  try { 
      const obj1 = {
        removeUser:[userId]
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
  const cookieStore = await cookies();
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
      const data =  await response.json();


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
   const cookieStore =await cookies()
   cookieStore.delete("session")
}
