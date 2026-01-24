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
import { cohostRespondToInternship } from "@/utils/internship";
import React from "react";

interface RejectRequestProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
  setInternshipData: React.Dispatch<React.SetStateAction<Internship[]>>;
}

export function RejectRequest({
  open,
  setOpen,
  internshipId,
  setInternshipData,
}: RejectRequestProps) {
  const { addToast } = Toaster();
  const handleRejectInternship = async () => {
    try {
      const res = await cohostRespondToInternship(internshipId);
      if (res) {
        addToast({
          type: "success",
          title: "Rejected Successfully",
          description: "Internship rejected successfully",
          duration: 3000,
        });
        setInternshipData((prev: Internship[]) =>
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently reject your
              internship and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectInternship}
              className=" bg-red-600 hover:bg-red-700 text-white"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
