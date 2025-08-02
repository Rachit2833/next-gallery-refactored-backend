"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "../_lib/context";

export function ThemeCard({ theme, onSelect }) {
  const [mode, setMode] = useState("light");
  const { selectedTheme, setSelectedTheme } = useUser()
  const imageUrl = mode === "dark" ? theme.darkImage : theme.lightImage;

  return (
    <Card
      className={cn(
        "w-full rounded-2xl  font-sans shadow-md overflow-hidden flex flex-col",
        mode === "dark" ? theme.darkClass : theme.lightClass
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="capitalize text-base font-semibold">
            {theme.name} Theme
          </CardTitle>
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="bg-muted p-0.5 h-8">
              <TabsTrigger value="light" className="w-8 h-7 text-lg">🌞</TabsTrigger>
              <TabsTrigger value="dark" className="w-8 h-7 text-lg">🌙</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="relative aspect-square overflow-hidden rounded-xl m-4 border bg-muted">
        <Image
          src={imageUrl}
          alt={`${theme.name} ${mode} preview`}
          fill
          className="object-contain"
        />
      </CardContent>


      <CardFooter className="flex flex-col justify-between p-4 pt-0 flex-1 min-h-[120px]">
        <div className="mb-4 text-sm text-center">
          {theme.description || (
            <>This is a preview of the <strong>{mode}</strong> mode.</>
          )}
        </div>
        <Button
          disabled={Number(selectedTheme) === theme.id}
          onClick={() => {
            localStorage.setItem("theme", theme.id)
            setSelectedTheme(theme.id)
          }}
          className="w-full h-9 text-sm font-medium"
        >
          Use {theme.name} Theme
        </Button>
      </CardFooter>



    </Card>
  );
}
