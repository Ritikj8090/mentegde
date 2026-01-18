import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, User } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PersonalSchema } from "./schema";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "../ui/textarea";
import { ProfilePictureEditButton } from "../settings/components/SettingComponents";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { UPLOAD_PHOTOS_URL } from "../config/CommonBaseUrl";

type PersonalInfoProps = {
  Personalform: UseFormReturn<z.infer<typeof PersonalSchema>>;
};

const PersonalInfo = ({ Personalform }: PersonalInfoProps) => {
  const [open, setOpen] = useState(false);

  console.log(UPLOAD_PHOTOS_URL + Personalform.getValues("avatar"));
  return (
    <>
      <Form {...Personalform}>
        <form className="space-y-8">
          <div className=" flex flex-col items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild onClick={() => setOpen(true)}>
                <Avatar className="mb-6 h-32 w-32 border-4 border-primary/20 ring-2 ring-primary/10 cursor-pointer">
                  <AvatarImage
                    src={UPLOAD_PHOTOS_URL + Personalform.getValues("avatar")}
                    alt={Personalform.getValues("full_name")}
                  />
                  <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                    {Personalform.getValues("full_name")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to upload a new profile picture</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <FormField
            control={Personalform.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I'm a software engineer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={Personalform.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" grid grid-cols-2 gap-5">
            <FormField
              control={Personalform.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Personalform.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" grid grid-cols-2 gap-5">
            <FormField
              control={Personalform.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Personalform.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <NativeSelect value={field.value} onChange={field.onChange}>
                      <NativeSelectOption value="">
                        Select gender
                      </NativeSelectOption>
                      <NativeSelectOption value="male">Male</NativeSelectOption>
                      <NativeSelectOption value="female">
                        Female
                      </NativeSelectOption>
                      <NativeSelectOption value="others">
                        Others
                      </NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Personalform.control}
              name="current_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <NativeSelect value={field.value} onChange={field.onChange}>
                      <NativeSelectOption value="">
                        Select status
                      </NativeSelectOption>
                      <NativeSelectOption value="fresher">
                        Fresher
                      </NativeSelectOption>
                      <NativeSelectOption value="employed">
                        Employed
                      </NativeSelectOption>
                      <NativeSelectOption value="self-employed">
                        Self-employed
                      </NativeSelectOption>
                      <NativeSelectOption value="other">
                        Other
                      </NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Personalform.control}
              name="hear_about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heard about us</FormLabel>
                  <FormControl>
                    <NativeSelect value={field.value} onChange={field.onChange}>
                      <NativeSelectOption value="">
                        Select status
                      </NativeSelectOption>
                      <NativeSelectOption value="google">
                        Google
                      </NativeSelectOption>
                      <NativeSelectOption value="facebook">
                        Facebook
                      </NativeSelectOption>
                      <NativeSelectOption value="linkedin">
                        Linkedin
                      </NativeSelectOption>
                      <NativeSelectOption value="other">
                        Other
                      </NativeSelectOption>
                      <NativeSelectOption value="friends">
                        Friends
                      </NativeSelectOption>
                    </NativeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" grid grid-cols-2 gap-5">
            <FormField
              control={Personalform.control}
              name="current_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="New Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Personalform.control}
              name="current_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Noida" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <ProfilePictureEditButton
        open={open}
        setOpen={setOpen}
        profilePicture={Personalform.getValues("avatar")}
        setProfilePicture={(url) => Personalform.setValue("avatar", url)}
      />
    </>
  );
};

export default PersonalInfo;
