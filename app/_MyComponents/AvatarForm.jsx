'use client';

import React, { useState } from 'react';
import AvatarPicker from './AvatarPicker';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { SubmitButton } from './SignUpForm';
import { updateImage } from '../_lib/actions';
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const AvatarForm = ({ image, onClose }) => {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <AvatarPicker selected={selected} setSelected={setSelected} current={image} />
      <form
        action={async (formData) => {
          const data = new FormData();
          data.append('id', localStorage.getItem('userId'));

          if (formData.get('photo')) {
            data.append('FormType', 1);
            data.append('ImageName', selected);
          } else {
            data.append('FormType', 2);
          }

          try {
            await updateImage(data);
            toast({
              title: 'Success',
              description: 'Avatar updated successfully.',
              variant: 'default',
            });
            onClose?.();
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to update avatar.',
              variant: 'destructive',
            });
          }
        }}
      >
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t " />
          <span className="mx-4 text-xs text-muted-foreground">Or</span>
          <div className="flex-grow border-t " />
        </div>

        <div className="py-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              // Do something with the selected file
            }}
            className="w-full px-0 py-0  border  rounded-md bg-muted text-muted-foreground
             file:px-4 file:py-2 file:rounded-none file:border-none file:bg-accent 
             file:text-accent-foreground file:m-0 file:mr-4 file:rounded-l-md file:shadow-none"
          />

        </div>



        <DialogFooter>
          <SubmitButton buttonText="Update" />
        </DialogFooter>
      </form>
    </>
  );
};

export default AvatarForm;
