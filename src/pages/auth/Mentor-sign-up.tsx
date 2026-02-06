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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  setUser,
  setWebsocketToken,
} from "@/components/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/components/config/CommonBaseUrl";
import { AxiosError } from "axios";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mentorSignup } from "@/utils/mentorAuth";
import { GoogleLogin } from "@react-oauth/google";

const formSchema = z
  .object({
    full_name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    repassword: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

const MentorSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.repassword) {
      form.setError("repassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    try {
      const result = await mentorSignup(
        values.full_name,
        values.email,
        values.password,
      );

      dispatch(setUser({ user: result.data }));
      dispatch(setWebsocketToken(result.websocketToken));
    } catch (error: AxiosError | any) {
      console.error("Error during sign up:", error);
      if (error.response.data.message === "Mentor already exists") {
        form.setError("email", {
          type: "manual",
          message: "Email is already registered",
        });
      }
    }
  };

  // const handleOtpVerification = async (otp: string) => {
  //   if (otp === "000000") {
  //     console.log("OTP verified. Submitting form...");
  //     try {
  //       const payload = {
  //         email: form.getValues("email"),
  //         username: form.getValues("username"),
  //         password: form.getValues("password"),
  //         role: "mentor",
  //       };

  //       const response = await apis.signup(payload);

  //       const { user, token } = response;

  //       console.log("Mentor created successfully:", user);
  //       dispatch(
  //         setUser({
  //           user: { ...user, is_active: false }, // 👈 force it to false
  //           token,
  //           role: user.role,
  //         })
  //       );
  //       setEmailVerification(false);
  //     } catch (error) {
  //       const axiosError = error as AxiosError;
  //       // ✅ Add this block
  //       if (axiosError.response?.status === 409) {
  //         alert("Email already exists. Please log in instead.");
  //       } else {
  //         console.error("SignUp: Error creating user:", error);
  //         alert("Something went wrong. Please try again.");
  //       }
  //     }
  //   } else {
  //     console.log("Invalid OTP");
  //   }
  // };

  return (
    <>
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
              Register as a Mentor
            </CardTitle>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-1  w-full flex items-center justify-center h-full"
            >
              <div className="flex flex-col gap-6 px-10 w-full">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Enter your email" {...field} />
                        </div>
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
                            placeholder="Minimum 8 characters"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className=" relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  // onClick={() => setEmailVerification(true)}
                  type="submit"
                  className="w-full"
                >
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
                    onClick={() =>
                      (window.location.href = `${BASE_URL}/auth/google?role=mentor`)
                    }
                  >
                    <Google />
                    <span className="ml-2">Sign up with Google</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="/sign-in/mentor"
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </main>
      {/* <OtpVerification
        email={form.getValues("email")}
        emailVerification={emailVerification}
        setEmailVerification={setEmailVerification}
        onOtpSubmit={handleOtpVerification} // Pass the OTP verification handler
      /> */}
    </>
  );
};

export default MentorSignUp;
