'use client'
import { CardContent } from "@/components/ui/card"
import {
   ContextMenu,
   ContextMenuCheckboxItem,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuLabel,
   ContextMenuRadioGroup,
   ContextMenuRadioItem,
   ContextMenuSeparator,
   ContextMenuShortcut,
   ContextMenuSub,
   ContextMenuSubContent,
   ContextMenuSubTrigger,
   ContextMenuTrigger,
} from "@/components/ui/context-menu"
function Messages({message}) {
   const currentUserId = localStorage.getItem("userId")
   return (
      <ContextMenu>
         <ContextMenuTrigger className={`p-2 rounded-lg max-w-[70%] break-words ${message?.senderId === currentUserId ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-start mr-auto"}`}>
               <li >
                  {message.content}
               </li>
         </ContextMenuTrigger>
         <ContextMenuContent className="w-64">
            <ContextMenuItem inset>
               Back
               <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
               Forward
               <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
               Reload
               <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
               <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
               <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>
                     Save Page As...
                     <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                  <ContextMenuItem>Name Window...</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Developer Tools</ContextMenuItem>
               </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
               Show Bookmarks Bar
               <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value="pedro">
               <ContextMenuLabel inset>People</ContextMenuLabel>
               <ContextMenuSeparator />
               <ContextMenuRadioItem value="pedro">
                  Pedro Duarte
               </ContextMenuRadioItem>
               <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
         </ContextMenuContent>
      </ContextMenu>
   )
}

export default Messages
