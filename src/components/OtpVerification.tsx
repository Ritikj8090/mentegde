import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SetStateAction } from "react";

const FormSchema = z.object({
  pin: z.string()
    .min(6, { message: "OTP must be exactly 6 digits." })
    .max(6, { message: "OTP must be exactly 6 digits." })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers." }),
});

export default function OtpVerification({email, emailVerification, setEmailVerification, onOtpSubmit}:{email: string, emailVerification:boolean, setEmailVerification:React.Dispatch<SetStateAction<boolean>>, onOtpSubmit: (otp: string)=> void;}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("OTP submitted:", data.pin);
    onOtpSubmit(data.pin); // Pass the OTP to the parent component
  };

  return (
    <Dialog open={emailVerification} onOpenChange={setEmailVerification}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            A 6-digit OTP has been sent to <b>{email}</b>. Please enter the code below to verify your email.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 flex flex-col items-center justify-center"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center">
                  <FormLabel>Enter OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
