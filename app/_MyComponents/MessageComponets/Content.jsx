
import Messages from "./Messages"
import { cookies } from "next/headers";

async function Content({decodedValue,query}) {
  const cookieStore = await cookies()
  const userId = decodedValue?.user?.id;
  const res = await fetch(`http://localhost:2833/message?_id=${userId}&selectedID=${query.id}`,{
    headers: {
      "Content-Type": "application/json",
       authorization: `Bearer ${cookieStore.get("session").value}`,
    },
  });

  
  const data = await res.json()

      return (
        data?.data?.map((message,index )=>{
              return <Messages key={index} message={message} />
        })
      )

}

export default Content


