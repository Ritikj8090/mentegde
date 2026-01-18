import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultAvatars } from "@/constant";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadAvatar } from "@/utils/upload";

const emailSchema = z.object({
  email: z.string().email("Email a valid email address."),
  confirmEmail: z.string().email("Email a valid email address."),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(2, "Enter current password"),
  password: z.string().min(2, "Enter password"),
  confirmPassword: z.string().min(2, "Enter password"),
});

export const EmailEditButton = () => {
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    if (values.email !== values.confirmEmail) {
      toast.warning("Emails do not match");
      return;
    }
    if (values.email === "currentEmail") {
      toast.warning("Email cannot be the same as the current email");
      return;
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.success("Email changed successfully.");
    console.log(values);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <span>Change</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Email Address</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your new email address and confirm it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const PasswordEditButton = () => {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password !== values.confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }
    if (values.currentPassword === values.password) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.success("Password changed successfully.");
    console.log(values);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div>
          <span>Change</span>
          <ChevronRight className="ml-2 h-4 w-4" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription>
            For your security, make sure your new password is strong and
            different from your previous ones.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save Password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const DeleteAccountButton = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div variant="destructive" size="sm">
          <span>Delete Account</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Your Account</AlertDialogTitle>
          <AlertDialogDescription className=" space-y-2">
            <p>
              Are you absolutely sure you want to delete your account? This
              action is permanent and cannot be undone.
            </p>
            <p className="text-sm text-red-500 font-medium">
              All your data, preferences, and account history will be
              permanently erased.
            </p>
            <p className="text-sm text-muted-foreground">
              If you're sure, click "Delete Account" below. Otherwise, click
              "Cancel" to keep your account.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className=" bg-red-600 hover:bg-red-600/80">
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ProfilePictureEditButton = ({
  open,
  setOpen,
  profilePicture,
  setProfilePicture,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profilePicture: string | undefined;
  setProfilePicture: (profilePicture: string | undefined) => void;
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profilePicture);
  const [file, setFile] = useState<File | null>(null);

  const uploadImage = async () => {
    if (!file) {
      return;
    }
    const result = await uploadAvatar(file);
    setProfilePicture(result.url);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatar(URL.createObjectURL(file));
      setFile(file);
    }
  };
  useEffect(() => {
    setSelectedAvatar(profilePicture);
  }, [profilePicture]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Profile Picture</AlertDialogTitle>
          <AlertDialogDescription>
            Upload a new profile picture (JPG, PNG, or GIF).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 flex items-center gap-5">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={selectedAvatar} alt={"NA"} />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Label htmlFor="custom-avatar">Or upload a custom avatar</Label>
            <Input
              id="custom-avatar"
              type="file"
              accept="image/*"
              className="mt-1"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault(); // stop auto close
              await uploadImage(); // wait for upload
              setOpen(false); // close after update
            }}
          >
            Save Profile Picture
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
