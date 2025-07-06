'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function ShareWrapper({ params }) {
   const router = useRouter();
   useEffect(() => {
      if (!params?.id || !params?.sharedId || params?.sharedId === localStorage.getItem('userId') ) {
         router.push('/');
      }
   }, [params, router]);

   return <div></div>;
}

export default ShareWrapper;
