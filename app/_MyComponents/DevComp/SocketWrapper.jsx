'use client';
import { useUser } from "@/app/_lib/context";
import { useEffect } from "react";
import { io } from "socket.io-client";
function SocketWrapper({ joinedGroup}) {
   const currentUserId = localStorage.getItem("userId")
   const { setSocket, setActiveUser, setMessages,  } = useUser()


   useEffect(() => {

      const socket = io("https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app", { query: { userId: currentUserId } });
      setSocket(socket);

      socket.on("connect", () => console.log("Connected with socket id:", socket.id));
      socket.on("onlineUsers", (mess) => setActiveUser(mess));
      socket.on("disconnect", () => console.log("Disconnected"));
      socket.on("newIoMessage", (message) => setMessages((prev) => [...prev, message]));
      socket.emit('joinGroups', joinedGroup)
      socket.on("groupMessage", (message) => {
         setMessages((prev) => [...prev, message])
      });
      return () => socket.disconnect();
   }, []);
   return (
      <>
      </>
   )
}

export default SocketWrapper
