import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Google from "@/components/svg/Google";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LOGO_NAME } from "@/constant";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const MentorSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await axios.post(
        "https://localhost:4000/api/auth/mentor/login",
        values,
        { withCredentials: true }
      );

      if (res.status === 200) {
        const { mentor } = res.data;

        // Store mentor info in localStorage
        localStorage.setItem("mentor", JSON.stringify(mentor));

        toast.success("Login successful!");
        navigate("/mentor-dash"); // Redirect to mentor dashboard
      }
    } catch (error: any) {
      console.error("Mentor login error:", error);
      const message =
        error.response?.data?.message || "Invalid email or password.";
      toast.error(message);
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
            <h1 className="text-2xl font-bold">Welcome Back to {LOGO_NAME}</h1>
            <p className="text-balance text-muted-foreground">
              Mentor Login Portal
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
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    type="email"
                    className="bg-gray-100 dark:bg-gray-800"
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span
                      className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="bg-gray-100 dark:bg-gray-800"
                      placeholder="Enter your password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
          >
            Login
          </Button>

          {/* OR Divider */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full justify-center"
            type="button"
          >
            <Google />
            <span className="ml-2">Login with Google</span>
          </Button>

          {/* Register Redirect */}
          <div className="text-center text-sm">
            Don’t have an account?{" "}
            <a
              href="/mentor-register"
              className="underline underline-offset-4 text-primary"
            >
              Sign up
            </a>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MentorSignIn;
