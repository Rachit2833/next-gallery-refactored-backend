"use client"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AvatarForm from "./AvatarForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function AvatarDialog({ image }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 rounded-full p-2 shadow-md"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
        </DialogHeader>
        <AvatarForm onClose={setOpen} image={image} />
      </DialogContent>
    </Dialog>
  );
}
