"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";


function Filter({ values, paramName, defaultValue, year }) {
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
    <>
      {values.map((item, i) => {
        const isActive = String(item.value) === String(activeFilter);

        return (
          <Button
            key={i}
            size="sm"
            className={`${
              isActive
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
            onClick={() => {
              handleParams(item.value);
              setActiveFilter(item.value);
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </>
  );
}

export default Filter;

