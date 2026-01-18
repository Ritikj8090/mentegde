import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DeleteAccountButton } from "./components/SettingComponents";

const Danger = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Delete Account</Label>
            <div className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </div>
          </div>
          <DeleteAccountButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default Danger;
