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
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function Toaster({ open, href, title, description, icon }: Props) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!open) return;

    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          window.location.reload();
          navigate(href); // change route if needed
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
          <div className="flex justify-center mb-3">{icon}</div>

          <AlertDialogTitle className="text-2xl text-center">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-sm text-center">
            {description}
            <br />
            <span className="font-bold text-primary">{countdown}</span>…
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
