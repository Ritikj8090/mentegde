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
import { deleteInternship } from "@/utils/internship";
import { X } from "lucide-react";
import React from "react";

interface DeleteInternshipProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
}
export function DeleteInternship({
  open,
  setOpen,
  internshipId,
}: DeleteInternshipProps) {
  const [openToaster, setOpenToaster] = React.useState(false);

  const handleDeleteInternship = async () => {
    try {
      const res = await deleteInternship(internshipId);
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              internship and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInternship} className=" bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster
        open={openToaster}
        title="Delete Successfully"
        description="Internship deleted successfully"
        icon={<X className="text-red-500" />}
        href="/internship-overview"
      />
    </>
  );
}
