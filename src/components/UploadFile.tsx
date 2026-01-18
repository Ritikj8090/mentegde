import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const uploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least 1 file")
    .max(MAX_FILES, `Max ${MAX_FILES} files`)
    .refine(
      (files) => files.every((f) => f.size <= MAX_FILE_SIZE_MB * 1024 * 1024),
      `Each file must be <= ${MAX_FILE_SIZE_MB}MB`
    )
    .refine(
      (files) => files.every((f) => ACCEPTED_MIME.includes(f.type)),
      "Only JPG/PNG/WEBP images or PDF are allowed"
    ),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

function fileKind(mime: string) {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return "other";
}

export function FileUploadForm({
  onUpload,
}: {
  onUpload: (files: File[]) => Promise<void> | void;
}) {
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { files: [] },
  });

  const files = form.watch("files");

  // previews for images only
  const previews = React.useMemo(() => {
    return files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : null));
  }, [files]);

  React.useEffect(() => {
    return () => {
      previews.forEach((p) => p && URL.revokeObjectURL(p));
    };
  }, [previews]);

  const addFiles = (newFiles: File[]) => {
    const existing = form.getValues("files");
    const merged = [...existing, ...newFiles].slice(0, MAX_FILES);
    form.setValue("files", merged, { shouldValidate: true });
  };

  const removeFile = (index: number) => {
    const existing = form.getValues("files");
    existing.splice(index, 1);
    form.setValue("files", [...existing], { shouldValidate: true });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = Array.from(e.dataTransfer.files || []);
    addFiles(dropped);
  };

  const onSubmit = async (values: UploadFormValues) => {
    await onUpload(values.files);
    form.reset({ files: [] });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormLabel>Upload files</FormLabel>

              <FormControl>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={onDrop}
                  className={cn(
                    "rounded-2xl border border-dashed p-6 transition-colors",
                    "bg-card hover:bg-muted/40",
                    "flex flex-col items-center justify-center text-center gap-2"
                  )}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium">Drag & drop</span> files here, or{" "}
                    <span className="font-medium">browse</span>
                  </div>

                  {/* Hidden input with a visible button */}
                  <Input
                    type="file"
                    className="hidden"
                    id="file-input"
                    multiple
                    accept={ACCEPTED_MIME.join(",")}
                    onChange={(e) => {
                      const picked = Array.from(e.target.files || []);
                      addFiles(picked);
                      e.currentTarget.value = "";
                    }}
                  />

                  <Button type="button" variant="secondary" asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      Choose files
                    </label>
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    Up to {MAX_FILES} files • JPG/PNG/WEBP/PDF • max {MAX_FILE_SIZE_MB}MB each
                  </div>
                </div>
              </FormControl>

              <FormMessage />

              {/* Selected files */}
              {files.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {files.map((f, idx) => {
                    const kind = fileKind(f.type);
                    return (
                      <div
                        key={`${f.name}-${idx}`}
                        className="flex items-center gap-3 rounded-xl border bg-card p-3"
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                          {kind === "image" && previews[idx] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previews[idx]!} alt={f.name} className="h-full w-full object-cover" />
                          ) : kind === "pdf" ? (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{f.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[11px]">
                              {f.type || "unknown"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(f.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </Form>
  );
}
