import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
};

export function Toaster({ open }: Props) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!open) return;

    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/dashboard"); // change route if needed
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, navigate]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="text-center">
        <AlertDialogHeader>
          <div className="flex justify-center mb-3">
            <CheckCircle2 className="text-green-500 size-14" />
          </div>

          <AlertDialogTitle className="text-2xl text-center">
            Onboarding Completed 🎉
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-sm text-center">
            You’re all set!  
            Redirecting to your dashboard in{" "}
            <span className="font-bold text-primary">{countdown}</span>…
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
