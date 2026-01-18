// ChangePassword.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ChangePassword component supports:
 * - Reset (forgot) flow: localStorage.resetAuth -> { email, role }
 *   -> call POST /auth/reset-password { email, newPassword, role }
 * - Change (logged-in) flow: localStorage.authUser -> { id, role }
 *   -> call POST /auth/change-password { id, role, currentPassword, newPassword }
 *
 * NOTE: API_BASE must match your backend
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/auth";

const ChangePassword = () => {
  const [isResetFlow, setIsResetFlow] = useState(false);
  const [resetAuth, setResetAuth] = useState(null); // { email, role }
  const [authUser, setAuthUser] = useState(null); // { id, role }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem("resetAuth");
    const a = localStorage.getItem("authUser");
    if (r) {
      try {
        const parsed = JSON.parse(r);
        setResetAuth(parsed);
        setIsResetFlow(true);
      } catch (e) {
        console.warn("Invalid resetAuth in localStorage");
      }
    }
    if (a) {
      try {
        const parsed = JSON.parse(a);
        setAuthUser(parsed);
      } catch (e) {
        console.warn("Invalid authUser in localStorage");
      }
    }
  }, []);

  const validatePassword = (pwd) => {
    if (!pwd || pwd.length < 8) return "Password must be at least 8 characters long";
    // add more validations if you want (uppercase, number, special char)
    return null;
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) return alert("New password and confirm password must match");
    const v = validatePassword(newPassword);
    if (v) return alert(v);

    try {
      setIsLoading(true);

      if (isResetFlow && resetAuth) {
        // Reset (forgot) flow -> use email + role
        const res = await fetch(`${API_BASE}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: resetAuth.email,
            newPassword,
            role: resetAuth.role,
          }),
        });
        const data = await res.json();
        setIsLoading(false);
        if (!res.ok) return alert(data.message || "Reset failed");
        // cleanup and navigate to login
        localStorage.removeItem("resetAuth");
        alert("Password reset successful. Please login with your new password.");
        window.location.href = "/login";
        return;
      }

      // Change password while logged in
      if (!authUser) {
        setIsLoading(false);
        return alert("No logged-in user found. Please login first.");
      }

      if (!currentPassword) {
        setIsLoading(false);
        return alert("Please enter your current password");
      }

      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: authUser.id,
          role: authUser.role,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) return alert(data.message || "Change password failed");

      alert("Password changed successfully. Please login again.");
      // Optionally clear auth info and redirect to login
      localStorage.removeItem("authUser");
      window.location.href = "/login";
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert("Server error while changing password");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {isResetFlow ? "Reset Password" : "Change Password"}
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto">
          {isResetFlow
            ? `Set a new password for ${resetAuth?.email} (${resetAuth?.role})`
            : "Enter your current password and set a new password."}
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        className="w-full max-w-md bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition"
      >
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 bg-transparent shadow-none w-full">
          <CardContent className="flex flex-col items-center gap-6 p-0">
            <Lock className="h-16 w-16 text-indigo-400" />

            <div className="flex flex-col gap-4 w-full mt-4">
              {!isResetFlow && (
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                />
              )}

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
              />

              <ul className="text-sm text-gray-400 space-y-1 mt-2 list-disc list-inside">
                <li>Password must be 8–60 characters long</li>
                <li>Must include at least one uppercase letter (recommended)</li>
                <li>Must include at least one number (recommended)</li>
                <li>Must include at least one special character (!@#$%^&*) (recommended)</li>
              </ul>

              <Button
                onClick={handleSubmit}
                className="mt-4 w-full bg-white text-black hover:bg-yellow-50 rounded-xl font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isResetFlow ? "Reset Password" : "Change Password"}
              </Button>

              <div className="text-sm text-gray-400 mt-2">
                {!isResetFlow && (
                  <span>
                    Want to reset via email? <a href="/forgot-password" className="text-white underline">Forgot Password</a>
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
