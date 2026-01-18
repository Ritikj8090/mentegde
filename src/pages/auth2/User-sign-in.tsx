import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Google from "@/components/svg/Google";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/components/features/auth/authSlice";
import { BASE_URL } from "@/components/config/CommonBaseUrl";
import { LOGO_NAME } from "@/constant";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }),
});

const UserSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoginError("");

      const res = await fetch(`https://localhost:4000/api/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password.trim(),
        }),
        credentials: "include", // 🔹 send cookies automatically
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Invalid email or password");
      }

      const data = await res.json(); // { user: {...} }

      // 🔹 Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔹 Store user in Redux
      dispatch(
        setUser({
          user: data.user,
          role: data.user.role as "user" | "mentor",
        })
      );

      console.log("Logged in user:", data.user);

      // 🔹 Redirect to dashboard
      navigate("/user/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.message || "Invalid email or password");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-1 w-full flex items-center justify-center h-full"
      >
        <div className="flex flex-col gap-6 w-[80%]">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Login to your {LOGO_NAME} account
            </p>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm text-primary underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <span
                      className="absolute right-2 top-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {loginError && <FormMessage>{loginError}</FormMessage>}

          {/* Login Button */}
          <Button type="submit" className="w-full">Log In</Button>

          {/* Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Google Auth */}
          <div>
            <Button
              variant="outline"
              className="w-full justify-center"
              type="button"
              onClick={() => {
                window.location.href = `${BASE_URL}/google?state=role:mentor`;
              }}
            >
              <Google />
              <span className="ml-2">Sign up with Google</span>
            </Button>
          </div>

          {/* Sign Up */}
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="underline underline-offset-4">Sign up</a>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UserSignIn;
