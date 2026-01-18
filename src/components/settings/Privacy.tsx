import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, Globe, Lock, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const Privacy = () => {
  const [isProfilePublic, setIsProfilePublic] = React.useState(true);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="w-6 h-6 mr-2" />
          Privacy
        </CardTitle>
        <CardDescription>Control your privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Profile Visibility</Label>
            <div className="text-sm text-muted-foreground">
              Make your profile visible to others
            </div>
          </div>
          <Switch
            checked={isProfilePublic}
            onCheckedChange={setIsProfilePublic}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Who Can Contact You</Label>
          <Select defaultValue="connected">
            <SelectTrigger>
              <SelectValue placeholder="Select contact preferences" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="connected">Connected Users Only</SelectItem>
              <SelectItem value="none">No One</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Profile Information Visibility</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Location</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Online Status</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Privacy;
