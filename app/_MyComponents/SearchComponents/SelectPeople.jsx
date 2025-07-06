import { useUser } from "@/app/_lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


function SelectPeople({ item }) {

   const { selectedInGroup, setSelectedInGroup } = useUser();

   const isSelected = selectedInGroup.includes(item._id);

   const handleSelectionChange = () => {
      if (isSelected) {
         setSelectedInGroup(selectedInGroup.filter((id) => id !== item._id));
      } else {
         setSelectedInGroup([...selectedInGroup, item._id]);
      }
   };

   return (
      <div>
         <div className="flex mb-2 p-2 gap-2 w-full h-16 items-center">
            <input type="checkbox" checked={isSelected} onChange={handleSelectionChange} />
            <Avatar className="h-12 w-12 relative object-cover">
               <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
               <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center h-full">
               <h1 className="text-[royalblue] cursor-pointer">{item.userId._id === localStorage.getItem('userId') ? item.friendId.name : item.userId.name}</h1>
            </div>
         </div>
         <Separator />
      </div>
   );
}

export default SelectPeople;
