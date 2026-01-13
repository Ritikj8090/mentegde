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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mentorLogin } from "@/utils/mentorAuth";
import { useDispatch } from "react-redux";
import {
  setUser,
  setWebsocketToken,
} from "@/components/features/auth/authSlice";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const MentorSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { user, websocketToken } = await mentorLogin(
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
          <img
            src="/mentors.png"
            alt="Mentor guiding"
            className="w-36 md:w-40 mb-4"
          />
          <CardTitle className="text-3xl font-bold">
            Why mentor on MentEdge?
          </CardTitle>
          <CardDescription>
            <ul className="space-y-3 text-lg text-center md:text-left">
              <li>✅ Share your knowledge & guide students</li>
              <li>✅ Build your personal brand as a mentor</li>
              <li>✅ Network with talented mentees & professionals</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome {LOGO_NAME}
          </CardTitle>
          <CardDescription className="text-center">
            Your Journey Starts Here
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-1  w-full flex items-center justify-center h-full"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                Sign Up
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
                >
                  <Google />
                  <span className="ml-2">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <a
                  href="/sign-up/mentor"
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

export default MentorSignIn;
