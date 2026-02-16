import { useState } from "react";
import { Download, Share2, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatFile } from "@/index";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface MediaPreviewPopupProps {
  isOpen: boolean;
  media: ChatFile | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDownload?: (media: ChatFile) => void;
  onShare?: (media: ChatFile) => void;
}

export function MediaPreviewPopup({
  isOpen,
  media,
  setIsOpen,
  onDownload,
  onShare,
}: MediaPreviewPopupProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (media) onDownload?.(media);
  };

  const handleShare = () => {
    if (media) {
      onShare?.(media);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isImage = media?.file_type?.startsWith("image/");
  const isPDF = media?.file_type?.startsWith("application/pdf") || media?.file_type === "pdf";

  const renderFileIcon = () => {
    if (isPDF) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-24 w-24 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">PDF Document</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-24 w-24 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <File className="h-12 w-12 text-blue-600 dark:text-blue-500" />
          </div>
          <p className="text-sm text-muted-foreground">{media?.file_type || "Unknown File"}</p>
        </div>
      </div>
    );
  };

  const renderMediaContent = () => {
    if (!media) return null;

    if (isImage) {
      return (
        <img
          src={media.file_url}
          alt={media.file_name || "Preview"}
          className="w-full h-full object-contain rounded-lg"
        />
      );
    }

    if (isPDF) {
      return (
        <object
          data={media.file_url}
          type="application/pdf"
          className="w-full h-full rounded-lg"
          aria-label="PDF preview"
        >
          {renderFileIcon()}
        </object>
      );
    }

    return renderFileIcon();
  };

  if (!media) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[90vw] h-[90vh] p-0 gap-0 flex flex-col">
        {/* Header with file name */}
        <div className="px-4 py-2 border-b">
          <h3 className="font-semibold truncate">
            {media.file_name || "File Preview"}
          </h3>
          {media.file_size && (
            <p className="text-sm text-muted-foreground">
              {(parseInt(media.file_size) / 1024).toFixed(2)} KB
            </p>
          )}
        </div>

        {/* Media content */}
        <div className="flex-1 overflow-hidden bg-muted/30">
          <div className="w-full h-full flex items-center justify-center">
            {renderMediaContent()}
          </div>
        </div>

        {/* Footer with actions */}
        <DialogFooter className="px-4 py-2 border-t sm:justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex-1 sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex-1 sm:flex-none"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}