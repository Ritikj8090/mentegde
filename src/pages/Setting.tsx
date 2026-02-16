import Danger from "@/components/settings/Danger";
import Appearance from "@/components/settings/Appearance";
import Account from "@/components/settings/Account";
import Notification from "@/components/settings/Notification";
import Privacy from "@/components/settings/Privacy";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-4 max-h-screen">
      <h1 className="md:text-3xl text-xl font-bold mb-4">Settings</h1>

      <div className="grid md:gap-6 gap-3">
        <Appearance />
        <Account />
        <Notification />
        <Privacy />
        <Danger />
      </div>
    </div>
  );
}
