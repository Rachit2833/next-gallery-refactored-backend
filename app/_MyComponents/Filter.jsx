"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // If you're using shadcn, `cn` should be available

function Filter({ values, paramName, defaultValue, year, setIsOpen }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    setActiveFilter(year || defaultValue);
  }, [year, defaultValue]);

  const handleParams = (filterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, filterValue);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-center">
      {values.map((item, i) => {
        const isActive = String(item.value) === String(activeFilter);

        return (
          <Button
            key={i}
            size="sm"
            variant={isActive ? "default" : "outline"} // use shadcn variants
            onClick={() => {
              handleParams(item.value);
              setActiveFilter(item.value);
              // setIsOpen?.(true); // optional if you want
            }}
            className={cn("capitalize", !isActive && "bg-transparent")}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

export default Filter;
