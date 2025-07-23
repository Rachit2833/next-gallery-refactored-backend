"use client"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import img from "@/public/favicon_io/android-chrome-512x512.png"
import {
  Home,
  ImageIcon,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PanelRight,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useUser } from "../_lib/context"
import BreadCrums from "./BreadCrumb"
import SearchLoader from "./Loaders/SearchLoader"
import { logOutUser } from "../_lib/actions"

function SideSheet() {
  const { searchVal, setSearchVaL, searchData, setSearchData, queryState,modelImages, setModelImages,setIsImageOpen, setModelType, } =useUser()
  const [isLoading, setIsLoading] = useState(false)
  const pathName = usePathname()
  const pathArray = pathName.split("/")
  const uniqueArray = [...new Set(pathArray)]
  const searchParams = useSearchParams()
  const router = useRouter()

  const navigationItems = [
    {
      name: "Albums",
      icon: Package,
      href: "/albums",
    },
    {
      name: "People & Sharing",
      icon: Users2,
      href: "/people",
    },
    {
      name: "Favourites",
      icon: Home,
      href: "/favourites",
    },
    {
      name: "Memory-Map",
      icon: LineChart,
      href: "/memory-map",
    },
    {
      name: "Post",
      icon: ImageIcon,
      href: "/post",
    },
  ]

  function handleParams(filter, filterName) {
    if (!searchParams) return
    const params = new URLSearchParams(searchParams)
    params.set(filterName, filter)
    router.replace(`${pathName}?${params}`, { scroll: false })
  }

  useEffect(() => {
  if (!searchVal) {
    setSearchData(null)
    setIsLoading(false)

    // Remove all search-related params
    const params = new URLSearchParams(searchParams)
    params.delete("query")
    params.delete("frId")
    params.delete("cod")
    // Add more keys here as needed

    router.replace(`${pathName}?${params}`, { scroll: false })
    return
  }

  async function search() {
    setIsLoading(true)
    const data = await fetch(
      `https://next-gallery-refactored-backend-btrh-pvihnvhaj.vercel.app/image/search/?query=${searchVal}`
    )
    const res = await data.json()
    setSearchData(res)
    setIsLoading(false)
  }

  search()
}, [searchVal])


  return pathName !== "/login" &&
    pathName !== "/sign-up" &&
    pathName !== "/not-found" ? (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelRight className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <SheetTitle />
          <nav className="grid gap-6 text-lg font-medium">
            <Link

              href="/"
              className={`flex items-center gap-4 px-2.5 hover:text-foreground ${pathName === "/"
                ? "text-foreground"
                : "text-muted-foreground"
                }`}
            >
              <Package2 />
              Home
            </Link>
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-4 px-2.5 hover:text-foreground ${pathName.startsWith(item.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {uniqueArray.map((item, i) => (
            <React.Fragment key={i}>
              <BreadCrums href={item === "" ? "/" : `/${item}`} item={item} />
              {uniqueArray[i + 1] && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className={`p-2 ${searchVal ? "rounded-xl border bg-card text-card-foreground shadow" : ""
          } top-1 absolute right-6`}
      >
        <div className="relative ml-auto flex gap-4 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={(e) => {
              setSearchVaL(e.target.value)
              handleParams(e.target.value, "query")
            }}
            value={searchVal || queryState || ""}
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src={img}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <form
                className="p-0 m-0"
                action={async () => {
                  await logOutUser()
                  router.push("/login")
                }}
              >
                <button type="submit">
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isLoading && searchVal ? (
          <SearchLoader />
        ) : (
          <div
            className={`${searchVal ? "" : "hidden"
              } gap-2 h-[85%] my-2 grid grid-rows-auto`}
          >
            {searchData?.peopleData?.length !== 0 ? (
              <Card className="p-2">
                <CardTitle className="my-2">People</CardTitle>
                <div className="flex gap-2">
                  {searchData?.peopleData?.map((item, i) => (
                    <Badge
                      key={i}
                      onClick={() => {
                        if(pathName!=="/"){
                          router.push("/")
                        }
                        setSearchVaL(item.label)
                        handleParams(item._id, "frId")
                      }}
                    >
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </Card>
            ) : null}
            {searchData?.LocationData?.length !== 0 ? (
              <Card className="p-2">
                <CardTitle className="my-2">Location</CardTitle>
                <div className="flex gap-2">
                  {searchData?.LocationData[0]?.Location?.map((item, i) => (
                    <Badge
                      key={i}
                      onClick={() => {
                         if(pathName!=="/"){
                          router.push("/")
                        }
                        setSearchVaL(item)
                        handleParams(item, "cod")
                      }}
                    >
                      {item.split(",")[0]}
                    </Badge>
                  ))}
                </div>
              </Card>
            ) : null}
            {searchData?.DesData?.length !== 0 ? (
              <ScrollArea className="border bg-card max-h-72 w-full p-2">
                {searchData?.DesData?.map((item, i) => {
                  return <div onClick={()=>{
                   setModelType(2)
                   setIsImageOpen(true)
                   setModelImages(item)
                  }} className=" cursor-pointer" key={i}>
                    <Alert className="my-1">
                      <div className="flex gap-4 items-center">
                        <ImageIcon className="h-4 w-4" />
                        <div className="flex-grow">
                          <AlertTitle>{item.Date.split("T")[0]}</AlertTitle>
                          <AlertDescription>{item.Description}</AlertDescription>
                        </div>
                        <div className="ml-auto shrink-0">
                          <Image
                            src={item?.ImageUrl}
                            alt="Thumbnail"
                            width={36}
                            height={24}
                            className="rounded-sm object-cover"
                            blurDataURL={item?.blurredImage}
                            loading="lazy"
                            quality={10}
                          />
                        </div>
                      </div>
                    </Alert>
                    <Separator />
                  </div>

                })}
              </ScrollArea>
            ) : null}
          </div>
        )}
      </div>
    </header>
  ) : null
}

export default SideSheet
