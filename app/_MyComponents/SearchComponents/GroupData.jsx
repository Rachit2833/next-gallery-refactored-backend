'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

 function GroupData({ group }) {
  
   if (!group) {
      return <p className="text-center text-red-500">Failed to load group data.</p>;
   }


   return (
      <div className="mx-auto bg-gray-200 shadow-lg rounded-lg p-6">
         {/* Group Image */}
         <div className="flex flex-col items-center">
            <Image
               width={160}
               height={160}
               className="ring-4 ring-gray-300 rounded-full w-40 h-40 object-cover"
               alt="Group Image"
               src={group.groupImage}
            />
            <h2 className="mt-4 text-xl font-bold">{group.name}</h2>
            <p className="text-gray-600 text-center">{group.description || "No description available."}</p>
         </div>

         {/* Group Members */}
         {group.people && group.people.length > 0 && (
            <div className="mt-6">
               <h3 className="text-lg font-semibold">Members</h3>
               <ul className="flex items-center mt-2">
                  {group.people.map((member, i) => {

                    return <li key={i} className="-ml-2 first:ml-0">
                        <Image
                           width={40}
                           height={40}
                           className="rounded-full w-10 h-10 object-cover ring-2 ring-white"
                           alt={member.name}
                           src={member.profilePicture || "https://images.unsplash.com/photo-1742790159516-bdb38cf17481?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8"}
                        />
                     </li>
 })}
               </ul>
            </div>
         )}
      </div>
   );
}

export default GroupData;
