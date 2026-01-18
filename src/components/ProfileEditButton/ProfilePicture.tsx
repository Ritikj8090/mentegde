import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Input } from "../ui/input";

import React from "react";

import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, Upload, X } from "lucide-react";

const ProfilePicture = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profilePreview, setProfilePreview] = useState("");

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files;
    if (file) {
      form.setValue("profilePicture", file); // Store the actual file in RHF
      setProfilePreview(URL.createObjectURL(file[0]));
    }
  };

  const clearProfilePicture = () => {
    form.setValue("profilePicture", null);
    setProfilePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <FormField
        control={form.control}
        name="profilePicture"
        render={() => (
          <FormItem className="flex flex-col items-center">
            <FormLabel className="text-center">Profile Picture</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profilePreview || ""} />
                    <AvatarFallback className="bg-muted">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => handleProfilePictureChange(e)}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {profilePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {profilePreview && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      size="icon"
                      onClick={clearProfilePicture}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Upload a profile picture (JPG, PNG, WebP, max 5MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfilePicture;