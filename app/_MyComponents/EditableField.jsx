"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

export const EditableField = ({
  label,
  value,
  type = "text",
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full mx-auto max-w-xl">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <Input
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-muted text-base outline-none"
            autoFocus
          />
        ) : (
          <p className="flex-1 px-3 py-2 border rounded-md bg-muted text-base truncate">
            {value}
          </p>
        )}

        {isEditing ? (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="default" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
