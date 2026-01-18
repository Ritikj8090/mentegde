import { Star, BookOpen, Briefcase, Mail, Phone, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { defaultAvatars } from "@/constant";
import { Input } from "../ui/input";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import React from "react";

import { useRef, useEffect } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  Camera,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "../store/store";
import apis from "@/services/api";
import { setUser } from "../features/auth/authSlice";

interface ProfileEditProps {
  edit: boolean;
  setEdit: (edit: boolean) => void;
}

const ProfileEdit = ({ edit, setEdit }: ProfileEditProps) => {
  return (
    <Dialog open={edit} onOpenChange={setEdit}>
      <DialogContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                console.log("🔥 Form onSubmit triggered");
                console.log("🔥 Form errors:", form.formState.errors);
                console.log("🔥 Form values:", form.getValues());
                return form.handleSubmit(onSubmit)(e);
              }}
            >
              <div className="space-y-8">
                <PersonalInformation form={form} />
                <ProfessionalInformation form={form} />
                <EducationBackground form={form} />
              </div>
              <div className=" px-5 pb-5">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={(e) => {
                    console.log("🔥 Button clicked");
                    console.log("🔥 Button type:", e.currentTarget.type);
                  }}
                >
                  Complete Profile
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
