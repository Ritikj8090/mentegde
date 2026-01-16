import { Toaster } from "@/components/Toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { acceptAndPost } from "@/utils/internship";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface AcceptAndPostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
}

export function AcceptAndPost({
  open,
  setOpen,
  internshipId,
}: AcceptAndPostProps) {
  const [openToaster, setOpenToaster] = React.useState(false);
  const handleAcceptAndPost = async () => {
    try {
      const res = await acceptAndPost(internshipId);
      console.log(res);
      if (res) {
        setOpenToaster(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to accept and post this internship?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This internship will be accepted and posted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptAndPost}>
              Accept & Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster
        open={openToaster}
        title="Accepted Successfully"
        description="Now this internship is published and will some in students dashboard."
        icon={<CheckCircle2 className="text-green-500" />}
        href="/internship-overview"
      />
    </>
  );
}
