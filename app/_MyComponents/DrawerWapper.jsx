'use client'
import { useEffect } from "react"
import GroupData from "./SearchComponents/GroupData"
import GroupDrawer from "./SearchComponents/GroupDrawer"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation"



function DrawerWapper({ group,inviteId }) {
   const {toast}=useToast()
   const router = useRouter()
   const data = group?.people?.map((member, i) => {
      return member._id
   })
   useEffect(()=>{
     if(data?.includes(localStorage.getItem('userId'))){
            toast({
                          title: "Already a member of the group",
                          description: "You have already joined the group",
                          action: (
                             <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                          ),
                       })
                
     }
      router.push("/friends")
   },[])
   return (
      !data?.includes(localStorage.getItem('userId'))?
       <GroupDrawer group={group}  inviteId={inviteId}>
         <GroupData group={group} />
      </GroupDrawer>:null
   )
}

export default DrawerWapper
