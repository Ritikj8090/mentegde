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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cohostRespondToInternship } from "@/utils/internship";
import { X } from "lucide-react";
import React from "react";

interface RejectRequestProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
}

export function RejectRequest({
  open,
  setOpen,
  internshipId,
}: RejectRequestProps) {
  const [openToaster, setOpenToaster] = React.useState(false);
  const handleRejectInternship = async () => {
    try {
      const res = await cohostRespondToInternship(internshipId);
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
      <Toaster
        open={openToaster}
        title="Rejected Successfully"
        description="Internship rejected successfully"
        icon={<X className="text-red-500" />}
        href="/internship-overview"
      />
    </>
  );
}
