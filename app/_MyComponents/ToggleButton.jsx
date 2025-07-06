'use client'

import { useState } from 'react';
import { useUser } from '../_lib/context';

function ToggleButton() {
   const { isOn, setIsOn } = useUser() // Track the slider state

   const handleToggle = () => {
      setIsOn(!isOn);
   };

   return (
      <div className="flex items-center gap-2">
         {/* Labels for ON and OFF */}
         <span className="text-sm font-medium text-gray-700">OFF</span>

         {/* The Slider */}
         <div
            onClick={handleToggle}
            className={`relative inline-flex items-center cursor-pointer w-14 h-8 bg-gray-300 rounded-full transition-all duration-300 ease-in-out`}
         >
            {/* The sliding circle inside the slider */}
            <span
               className={`absolute w-6 h-6 bg-white rounded-full border border-gray-400 transition-transform duration-300 ease-in-out transform ${isOn ? 'translate-x-8' : 'translate-x-0'}`}
            />
         </div>

         {/* Labels for ON */}
         <span className="text-sm font-medium text-gray-700">ON</span>
      </div>
   );
}

export default ToggleButton;
