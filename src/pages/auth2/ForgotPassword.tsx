// ForgotPassword.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

/**
 * ForgotPassword - supports both "user" and "mentor"
 *
 * Flow:
 * 1) Enter email + select role -> Send OTP -> server returns (and in dev returns OTP for testing)
 * 2) Enter OTP -> Verify OTP -> on success store { email, role } in localStorage and redirect to /change-password
 *
 * NOTE: update API_BASE if your backend URL differs.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "mentor">("user");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentOtpPreview, setSentOtpPreview] = useState<string | null>(null); // for dev/testing

  const handleSendOtp = async () => {
    if (!email) return alert("Please enter email.");
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) return alert(data.message || "Failed to send OTP");

      // In development backend we return OTP in response (remove in production).
      if (data.otp) setSentOtpPreview(data.otp);

      setShowOtp(true);
      // Optionally notify user that OTP has been sent via email/SMS
      alert("OTP sent — check your email or contact. (In dev OTP may be shown)");
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert("Server error while sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, role }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) return alert(data.message || "OTP verification failed");

      // Save email + role so ChangePassword page knows to perform reset flow
      localStorage.setItem("resetAuth", JSON.stringify({ email, role }));
      // redirect to change-password route
      window.location.href = "/change-password";
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      alert("Server error during OTP verification");
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
          Forgot <span className="text-yellow-50">Password</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto">
          Enter your email & choose whether you're a user or mentor to reset your password.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        className="w-full max-w-md bg-gradient-to-b from-gray-800 to-black rounded-2xl p-10 shadow-lg hover:shadow-indigo-500/40 transition"
      >
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 bg-transparent shadow-none w-full">
          <CardContent className="flex flex-col items-center gap-6 p-0">
            <UserCircle className="h-16 w-16 text-indigo-400" />

            {!showOtp && (
              <div className="flex flex-col gap-4 w-full mt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "user" | "mentor")}
                  className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                >
                  <option value="user">User</option>
                  <option value="mentor">Mentor</option>
                </select>

                <Button
                  onClick={handleSendOtp}
                  className="mt-4 w-full bg-white text-black hover:bg-yellow-50 rounded-xl font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>

                {sentOtpPreview && (
                  <div className="text-sm text-gray-400 mt-2">
                    (Dev preview OTP: <span className="font-medium text-white">{sentOtpPreview}</span>)
                  </div>
                )}
              </div>
            )}

            {showOtp && (
              <div className="flex flex-col gap-4 w-full mt-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="p-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-gray-500"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyOtp}
                    className="mt-4 flex-1 bg-white text-black hover:bg-yellow-50 rounded-xl font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                    }}
                    className="mt-4 bg-transparent border border-gray-700 text-white rounded-xl"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
