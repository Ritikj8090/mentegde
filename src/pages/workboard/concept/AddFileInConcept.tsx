import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Concept, ConceptFile } from "@/index";
import { FileUploadForm } from "@/components/UploadFile";
import { uploadConceptFiles } from "@/utils/internship";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EditConceptProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conceptsData: Concept;
  setFiles: React.Dispatch<React.SetStateAction<ConceptFile[]>>;
}

export function AddFileInConcept({
  open,
  setOpen,
  conceptsData,
  setFiles,
}: EditConceptProps) {
    const [fileUploading, setFileUploading] = useState(false);
  const handleFileUpload = async (files: File[]) => {
    setFileUploading(true);
    const res = await uploadConceptFiles(conceptsData.id, files);
    setFiles((prev) => [...prev, ...res.files]);
    setOpen(false);
    setFileUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("min-w-150", fileUploading && "opacity-50 pointer-events-none")}>
        <DialogHeader>
          <DialogTitle>Edit Concept</DialogTitle>
          <DialogDescription>
            Make changes to your concept here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <FileUploadForm
          onUpload={(files: File[]) => {
            handleFileUpload(files);
          }}
          uploading={fileUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
