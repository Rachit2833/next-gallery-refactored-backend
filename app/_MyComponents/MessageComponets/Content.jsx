"use client";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import { useUser } from "@/app/_lib/context";
import MessageLoader from "../Loaders/MessageLoader";

function Content({ sessionToken, decodedValue }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isSelected } = useUser();
  console.log(isSelected,"selec");
  useEffect(() => {
    let isMounted = true; 

    const fetchMessages = async () => {
      if (!decodedValue?.user?.id || !isSelected?._id || !sessionToken) return;

      setLoading(true);
      try {
        const userId = decodedValue.user.id;
        const res = await fetch(
          `http://localhost:2833/message?_id=${userId}&selectedID=${isSelected._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        const data = await res.json();
        if (isMounted) {
          setMessages(data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [sessionToken, decodedValue?.user?.id, isSelected?._id]);

  if (loading) {
    return <MessageLoader />;
  }

  return (
    <>
      {messages.length > 0 ? (
        messages.map((message, index) => <Messages key={index} message={message} />)
      ) : (
        <p className="text-gray-500">No messages found.</p>
      )}
    </>
  );
}

export default Content;
