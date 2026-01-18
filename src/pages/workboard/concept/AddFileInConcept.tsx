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
  const handleFileUpload = async (files: File[]) => {
    const res = await uploadConceptFiles(conceptsData.id, files);
    setFiles((prev) => [...prev, ...res.files]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-150">
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
        />
      </DialogContent>
    </Dialog>
  );
}
