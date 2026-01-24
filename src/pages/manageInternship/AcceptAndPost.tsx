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
import { Internship } from "@/index";
import { acceptAndPost } from "@/utils/internship";
import React from "react";

interface AcceptAndPostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
  setWorkflowData: React.Dispatch<React.SetStateAction<Internship[]>>;
}

export function AcceptAndPost({
  open,
  setOpen,
  internshipId,
  setWorkflowData,
}: AcceptAndPostProps) {
  const { addToast } = Toaster();
  const handleAcceptAndPost = async () => {
    try {
      const res = await acceptAndPost(internshipId);
      if (res) {
        addToast({
          type: "success",
          title: "Accepted Successfully",
          description:
            "Now this internship is published and will some in students dashboard.",
          duration: 3000,
        });
        setWorkflowData((prev: Internship[]) =>
          prev.filter((item) => item.id !== internshipId),
        );
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
    </>
  );
}
