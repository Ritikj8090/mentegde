import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronRight, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  EmailEditButton,
  PasswordEditButton,
  ProfilePictureEditButton,
} from "./components/SettingComponents";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import React from "react";
import { getPasswordLastChanged } from "@/utils/auth";
import { format } from "date-fns";

const Account = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [lastPasswordChange, setLastPasswordChange] =
    React.useState();

  const [openProfilePictureEdit, setOpenProfilePictureEdit] =
    React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState(
    user?.avatar || "/profilePicture.png",
  );

  React.useEffect(() => {
    const fetchLastPasswordChange = async () => {
      const res = await getPasswordLastChanged();
      setLastPasswordChange(res);
    };
    fetchLastPasswordChange();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-6 h-6 mr-2" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account preferences and security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Avatar className=" w-16 h-16">
                <AvatarImage
                  src={user?.avatar || "/profilePicture.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenProfilePictureEdit(true)}
              >
                Change
                <ChevronRight />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password</Label>
                {lastPasswordChange && (
                  <div className="text-sm text-muted-foreground">
                    Last changed {format(lastPasswordChange, "PP")}
                  </div>
                )}
              </div>
              <PasswordEditButton />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <div className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </div>
              </div>
              <Button variant="outline" size="sm">
                Setup
                <Shield className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProfilePictureEditButton
        type="change"
        open={openProfilePictureEdit}
        setOpen={setOpenProfilePictureEdit}
        profilePicture={profilePicture}
        setProfilePicture={(url) => setProfilePicture(url || "")}
      />
    </>
  );
};

export default Account;
