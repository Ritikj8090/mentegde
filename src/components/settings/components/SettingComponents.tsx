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
import { ChevronRight, Eye, EyeOff } from "lucide-react";
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
import { ChangeEvent, useEffect, useState } from "react";
import { updateUserORMentorInfo, uploadAvatar } from "@/utils/upload";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store";
import { setLoading } from "@/components/store/slices/loadingSlice";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/utils/auth";
import { AxiosError } from "axios";

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
        <Button variant="outline" size="sm">
          Change
          <ChevronRight />
        </Button>
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
  const [open, setOpen] = useState(false); // ✅ control dialog
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password !== values.confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    if (values.currentPassword === values.password) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }

    try {
      await changePassword(values.currentPassword, values.password);

      toast.success("Password changed successfully.");
      window.location.reload(); // reload to update password change time, can be optimized by just updating the state

      setOpen(false); // ✅ close dialog on success
    } catch (error: AxiosError | any) {
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Change
          <ChevronRight />
        </Button>
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
          <form className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...field}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {showCurrentPassword ? (
                          <EyeOff
                            className="cursor-pointer h-4 w-5"
                            onClick={() => setShowCurrentPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer h-4 w-5"
                            onClick={() => setShowCurrentPassword(true)}
                          />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2">
                        {showNewPassword ? (
                          <EyeOff
                            className="cursor-pointer h-4 w-5"
                            onClick={() => setShowNewPassword(false)}
                          />
                        ) : (
                          <Eye
                            className="cursor-pointer h-4 w-5"
                            onClick={() => setShowNewPassword(true)}
                          />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...field}
                    />
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
            type="button"
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
  type = "default",
  open,
  setOpen,
  profilePicture,
  setProfilePicture,
}: {
  type?: "default" | "change";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profilePicture: string | undefined;
  setProfilePicture: (profilePicture: string | undefined) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.loading);
  const [selectedAvatar, setSelectedAvatar] = useState(profilePicture);
  const [file, setFile] = useState<File | null>(null);

  const uploadImage = async () => {
    if (!file) {
      return;
    }
    dispatch(setLoading(true));
    const result = await uploadAvatar(file);
    if (result.url && type === "change") {
      await updateUserORMentorInfo({ avatarUrl: result.url });
      toast.success("Profile picture updated successfully.");
      window.location.reload(); // reload to show new avatar, can be optimized by just updating the state
    }
    setLoading(false);
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
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Update Picture"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
