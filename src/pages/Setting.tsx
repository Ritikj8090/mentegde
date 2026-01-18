import Danger from "@/components/settings/Danger";
import Appearance from "@/components/settings/Appearance";
import Account from "@/components/settings/Account";
import Notification from "@/components/settings/Notification";
import Privacy from "@/components/settings/Privacy";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="grid gap-6">
        <Appearance />
        <Account />
        <Notification />
        <Privacy />
        <Danger />
      </div>
    </div>
  );
}
