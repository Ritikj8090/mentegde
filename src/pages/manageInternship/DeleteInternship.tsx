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
import { deleteInternship } from "@/utils/internship";
import { X } from "lucide-react";
import React from "react";

interface DeleteInternshipProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
  setWorkflowData: React.Dispatch<React.SetStateAction<Internship[]>>;
}
export function DeleteInternship({
  open,
  setOpen,
  internshipId,
  setWorkflowData,
}: DeleteInternshipProps) {
  const { addToast } = Toaster();

  const handleDeleteInternship = async () => {
    try {
      const res = await deleteInternship(internshipId);
      if (res) {
        addToast({
          type: "success",
          title: "Delete Successfully",
          description: "Internship deleted successfully",
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              internship and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInternship}
              className=" bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
