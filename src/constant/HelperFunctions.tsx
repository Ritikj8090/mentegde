import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { SetStateAction } from "react";
//please
// Timer based on start_time
export const updateRemainingTimer = (
  sessionEndTime: string,
  setRemainingTime: React.Dispatch<React.SetStateAction<string>>,
) => {
  const now = Date.now();
  const endTime = new Date(sessionEndTime).getTime();
  const difference = endTime - now;
  if (difference <= 0) {
    setRemainingTime("00:00:00");
    return;
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  setRemainingTime(formattedTime);
};

// Function to calculate live duration
export const getLiveDuration = (
  sessionStartTime: string,
  setSessionLive: React.Dispatch<React.SetStateAction<string>>,
) => {
  const startTime = new Date(sessionStartTime).getTime();
  const now = Date.now();
  const difference = now - startTime; // Difference in milliseconds
  if (difference <= 0) {
    setSessionLive("00:00:00"); // If session hasn't started yet
    return;
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  setSessionLive(
    `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`,
  );
};

export function calculateAge(dob: Date | string | undefined): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // If birthday hasn't occurred yet this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

// Utility function to format file size
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function FilePreview({ file }: { file: any }) {
  const isPdf = file.file_type === "application/pdf";
  const isImage = file.file_type.startsWith("image/");
  const previewUrl = file.file_url;

  // Cloudinary PDF thumbnail
  const pdfThumb = file.file_url
    .replace("/raw/upload/", "/image/upload/")
    .replace(".pdf", ".jpg");

  const boxClass =
    "w-[276px] h-[276px] rounded-lg border bg-muted overflow-hidden cursor-pointer";

  // IMAGE PREVIEW
  if (isImage) {
    return (
      <img
        src={previewUrl}
        className={`${boxClass} object-cover`}
        onClick={() => window.open(previewUrl, "_blank")}
      />
    );
  }

  // PDF PREVIEW THUMBNAIL
  if (isPdf) {
    return (
      <div
        className={boxClass}
        onClick={() => window.open(file.file_url, "_blank")}
      >
        <img
          src={pdfThumb}
          className="w-full h-full object-cover"
          alt={file.file_name}
        />
      </div>
    );
  }

  // OTHER FILES
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg max-w-xs bg-muted">
      <FileText className="h-5 w-5" />
      <div className="flex-1 truncate">
        <p className="text-sm font-medium truncate">{file.file_name}</p>
      </div>
      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    </div>
  );
}



