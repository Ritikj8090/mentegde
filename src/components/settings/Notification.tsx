import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import React from "react";

const Notification = () => {
  const [isPushEnabled, setIsPushEnabled] = React.useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = React.useState(true);
  const [sessionReminders, setSessionReminders] = React.useState(true);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-6 h-6 mr-2" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <div className="text-sm text-muted-foreground">
              Receive notifications on your device
            </div>
          </div>
          <Switch checked={isPushEnabled} onCheckedChange={setIsPushEnabled} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <div className="text-sm text-muted-foreground">
              Receive email updates
            </div>
          </div>
          <Switch
            checked={isEmailEnabled}
            onCheckedChange={setIsEmailEnabled}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Reminders</Label>
            <div className="text-sm text-muted-foreground">
              Get reminded about upcoming sessions
            </div>
          </div>
          <Switch
            checked={sessionReminders}
            onCheckedChange={setSessionReminders}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Reminder Time</Label>
          <Select defaultValue="30">
            <SelectTrigger>
              <SelectValue placeholder="Select reminder time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 minutes before</SelectItem>
              <SelectItem value="5">5 minutes before</SelectItem>
              <SelectItem value="10">10 minutes before</SelectItem>
              <SelectItem value="15">15 minutes before</SelectItem>
              <SelectItem value="30">30 minutes before</SelectItem>
              <SelectItem value="60">1 hour before</SelectItem>
              <SelectItem value="120">2 hours before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default Notification;
