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
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  setWebsocketToken,
} from "@/components/features/auth/authSlice";
import { BASE_URL } from "@/components/config/CommonBaseUrl";
import { LOGO_NAME } from "@/constant";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { userLogin } from "@/utils/auth";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const UserSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { user, websocketToken } = await userLogin(
        values.email,
        values.password
      );

      dispatch(setUser({ user }));
      dispatch(setWebsocketToken(websocketToken));
    } catch (error: AxiosError | any) {
      console.error("Login failed:", error);
      if (error.response.data.message.includes("Invalid")) {
        form.setError("password", {
          type: "manual",
          message: "Invalid credentials",
        });
        form.setError("email", {
          type: "manual",
          message: "Invalid credentials",
        });
      }
    }
  };

  return (
    <main className=" container mx-auto grid grid-cols-2 h-full py-2 gap-3">
      <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50  flex flex-col items-center">
        <CardHeader className=" flex flex-col items-center space-y-5">
          <img src="/user.png" alt="mentor" className="w-36 md:w-40 mb-4" />
          <CardTitle className="text-3xl font-bold">
            Why join MentEdge?
          </CardTitle>
          <CardDescription>
            <ul className="space-y-3 text-lg text-center md:text-left">
              <li>✅ Build your profile & let mentors guide you</li>
              <li>✅ Get internships & learning opportunities</li>
              <li>✅ Connect with top mentors & grow your career</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Login to your {LOGO_NAME} account
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-1 w-full flex items-center justify-center h-full"
          >
            <div className="flex flex-col gap-6 w-[80%]">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className=" flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <div className=" relative">
                        <span
                          className=" absolute right-2 top-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </span>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Log In
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="">
                <Button
                    variant="outline"
                    className="w-full justify-center"
                    type="button"
                    onClick={() =>
                      (window.location.href = `${BASE_URL}/auth/google?role=user`)
                    }
                  >
                  <Google />
                  <span className="ml-2">Sign up with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/sign-up/user"
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default UserSignIn;
