'use client'
import { Input } from "@/components/ui/input"
import { Ellipsis, EllipsisVertical, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useUser } from "../_lib/context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children } from "react"


function SeachBar({children,}) {
    const { setIsSelected, setGroupMenu, groupMenu, isInputing, setIsInputing }=useUser()
    const pathName= usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    function handleParams(filter, filterName) {
        if (!searchParams) return
        const params = new URLSearchParams(searchParams)
        params.set(filterName, filter)
        router.replace(`${pathName}?${params}`, { scroll: false })
    }
   return (
       <>
       <div className="  relative ml-auto flex justify-between gap-4  md:grow-0">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
               onChange={(e) =>{
                setIsInputing(e.target.value)
                setIsSelected(null)
            }}
               type="search"
               placeholder="Search..."
               className="w-full  rounded-lg bg-background pl-8  md:w-[200px] lg:w-[320px]" />
                    {children}
        </div>
       </>
   )
}

export default SeachBar
