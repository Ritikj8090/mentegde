import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Folder,
  Lightbulb,
  Pen,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Concept, ConceptFile } from "@/index";
import { cn } from "@/lib/utils";
import { deleteConceptFile, getConceptFiles, updateConceptProgress } from "@/utils/internship";
import { FileIcon, StatusBadge } from ".";
import { AddConcepts } from "../workboard/concept/AddConcepts";
import { EditConcept } from "../workboard/concept/EditConcept";
import { AddFileInConcept } from "../workboard/concept/AddFileInConcept";

interface ConceptSectionProps {
  concepts: Concept[];
  milestoneId: string;
  role: string;
}

export function ConceptsSection({
  concepts,
  milestoneId,
  role,
}: ConceptSectionProps) {
  const [conceptsData, setConceptsData] = useState<Concept[]>(concepts);
  const [showAddConcepts, setShowAddConcepts] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [expandedConcepts, setExpandedConcepts] = useState<string[]>([]);
  const completedCount = concepts.filter(
    (c) => c.progress.status === "completed",
  ).length;

  const toggleConcept = (id: string) => {
    setExpandedConcepts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    setConceptsData(concepts);
  }, [concepts]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Concepts</h3>
              {role === "user" && (
                <p className="text-sm text-muted-foreground">
                  {completedCount} / {conceptsData.length} completed
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border text-muted-foreground">
              {concepts.length} items
            </Badge>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                expanded && "rotate-180",
              )}
            />
          </div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border-t">
                {conceptsData.length > 0 ? (
                  <>
                    {conceptsData.map((concept) => (
                      <ConceptTabs
                        key={concept.id}
                        concept={concept}
                        setConceptsData={setConceptsData}
                        role={role}
                        expandedConcepts={expandedConcepts}
                        toggleConcept={toggleConcept}
                      />
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center border-t">
                    <p className="text-sm text-muted-foreground">
                      No items yet
                    </p>
                  </div>
                )}
                {role === "mentor" && (
                  <button
                    className="p-3 flex items-center border-t justify-center border-border w-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    onClick={() => setShowAddConcepts(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add a concept
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {showAddConcepts && (
        <AddConcepts
          open={showAddConcepts}
          setOpen={setShowAddConcepts}
          milestoneId={milestoneId}
          setConceptsData={setConceptsData}
          conceptDataLength={conceptsData.length}
        />
      )}
    </>
  );
}

const ConceptTabs = ({
  concept,
  setConceptsData,
  role,
  expandedConcepts,
  toggleConcept,
}: {
  concept: Concept;
  setConceptsData: React.Dispatch<React.SetStateAction<Concept[]>>;
  role: string;
  expandedConcepts: string[];
  toggleConcept: (id: string) => void;
}) => {
  const [files, setFiles] = useState<ConceptFile[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [editConcept, setEditConcept] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await getConceptFiles(concept.id);
      setFiles(res);
    };
    fetchFiles();
  }, [concept.id]);

  const handleStatusChange = async (
    event: React.MouseEvent,
    conceptId: string,
    nextStatus: "completed" | "pending",
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // 🔥 Optimistic UI update
    setConceptsData((prev) =>
      prev.map((concept) =>
        concept.id === conceptId
          ? {
              ...concept,
              progress: {
                ...concept.progress,
                status: nextStatus,
              },
            }
          : concept,
      ),
    );

    try {
      const res = await updateConceptProgress(conceptId, nextStatus);

      // ✅ Sync with backend response
      setConceptsData((prev) =>
        prev.map((concept) =>
          concept.id === conceptId
            ? {
                ...concept,
                progress: {
                  ...concept.progress,
                  status: res.progress.status,
                },
              }
            : concept,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const downloadFile = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop()!;
    a.click();
  };

  const deleteFile = async (fileId: string) => {
    // Optimistic UI update
    const originalFiles = files;
    setFiles((prev) => prev.filter((file) => file.id !== fileId));

    try {
      // Call API to delete file
      await deleteConceptFile(concept.id, fileId);
    } catch (error) {
      console.error("Failed to delete file:", error);
      // Revert UI if deletion fails
      setFiles(originalFiles);
    }
  };

  return (
    <>
      <div
        key={concept.id}
        className="border-b hover:bg-muted/50 last:border-0"
      >
        {/* Concept Header */}
        <button
          onClick={() => toggleConcept(concept.id)}
          className="w-full flex items-center gap-4 p-4 transition-colors"
        >
          {role === "user" && (
            <Checkbox
              checked={concept.progress.status === "completed"}
              onClick={(event) =>
                handleStatusChange(
                  event,
                  concept.id,
                  concept.progress.status === "completed"
                    ? "pending"
                    : "completed",
                )
              }
              disabled={concept.progress.status === "completed"}
            />
          )}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{concept.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {concept.description}
            </p>
          </div>
          {role === "mentor" && (
            <div className=" flex gap-2 items-center">
              <Pen
                className=" cursor-pointer"
                size={13}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setEditConcept(true);
                }}
              />
              <Upload
                className=" cursor-pointer"
                size={13}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpenUpload(true);
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border text-muted-foreground">
              <Folder className="h-3 w-3 mr-1" />
              {files.length} files
            </Badge>
            <StatusBadge
              status={
                role === "user"
                  ? (concept.progress?.status as string)
                  : concept.status
              }
            />
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                expandedConcepts.includes(concept.id) && "rotate-90",
              )}
            />
          </div>
        </button>

        {/* Files */}
        <AnimatePresence>
          {expandedConcepts.includes(concept.id) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className=" border-t"
            >
              <div className="p-4 pl-12">
                <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  Learning Materials
                </h5>
                <div className="grid gap-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg  border transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <FileIcon type={file.file_type} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {file.file_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => window.open(file.file_url, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => downloadFile(file.file_url)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {role === "mentor" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                            onClick={() => deleteFile(file.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {editConcept && (
        <EditConcept
          open={editConcept}
          setOpen={setEditConcept}
          conceptsData={concept}
          setConceptsData={setConceptsData}
        />
      )}
      {openUpload && (
        <AddFileInConcept
          open={openUpload}
          setOpen={setOpenUpload}
          conceptsData={concept}
          setFiles={setFiles}
        />
      )}
    </>
  );
};
