"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import gsap from "gsap";
import { Check, Group, MoveLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Form1 from "./Form1";
import Form2 from "./Form2";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/_lib/context";

function AddPeopleFolder({ res }) {

   const [formNum,setFormNum]=useState(1)
   const listRef = useRef(null);
   function nextStep() {
      if (listRef.current) {
         gsap.to(listRef.current, {
            x: -500,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
               setFormNum((prev) => (prev + 1)); // Go to next form
               gsap.fromTo(listRef.current,
                  { x: 500, opacity: 0 },
                  { x: 0, opacity: 1, duration: 0.1 }
               );
            },
         },);
      }
   }
   function prvStep() {
      if (listRef.current) {
         gsap.to(listRef.current, {
            x: 500,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
               setFormNum((prev) => (prev - 1)); // Go to next form
               gsap.fromTo(listRef.current,
                  { x: -500, opacity: 0 },
                  { x: 0, opacity: 1, duration: 0.1 }
               );
            },
         },);
      }
   }


   return (
      <Popover>
         <PopoverTrigger>
            <li className="my-2">
               <Group />
            </li>
         </PopoverTrigger>
         <PopoverContent className="py-2 overflow-hidden w-[28rem] px-4">
            <h1 className="text-center">New Group</h1>
            <h2>Select People to be in your group</h2>
            <div className="flex h-[3rem] justify-between items-center">
               {formNum > 1 ? <Button onClick={()=>{
                  prvStep()
               }} className="flex items-center gap-1">
                  Back <MoveLeft />
               </Button> : <div></div>}
              
              {formNum<2? <Button onClick={nextStep} className="flex items-center gap-1">
                  Done <Check />
               </Button>:null}
            </div>

               <div ref={listRef}>
                  
               {formNum === 1 ? <Form1  res={res.data} />
                  : <Form2 />}
               </div>

         </PopoverContent>
      </Popover>
   );
}

export default AddPeopleFolder;
