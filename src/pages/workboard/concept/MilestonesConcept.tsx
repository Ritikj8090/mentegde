import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronRight,
  Lightbulb,
  Pen,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { AddConcepts } from "./AddConcepts";
import { Concept, ConceptFile } from "@/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getConceptFiles, updateConceptProgress } from "@/utils/internship";
import { EditConcept } from "./EditConcept";
import { AddFileInConcept } from "./AddFileInConcept";
import { getFileIcon } from "../WorkboardPage";

interface WorkboardSectionProps {
  concepts: Concept[];
  milestoneId: string;
  role: string;
}

const MilestonesConcept = ({
  concepts,
  milestoneId,
  role,
}: WorkboardSectionProps) => {
  const [conceptsData, setConceptsData] = useState<Concept[]>(concepts);
  const [showAddConcepts, setShowAddConcepts] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount =
    conceptsData.filter((concept) => concept.progress.status === "completed")
      .length || 1;

  useEffect(() => {
    setConceptsData(concepts);
  }, [concepts]);
  return (
    <>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-amber-500/10")}>
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-foreground">
                Concepts
              </span>
              {role === "user" && (
                <span className="text-xs text-muted-foreground">
                  {completedCount} / {conceptsData.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {conceptsData.length} items
            </Badge>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="border-t border-border">
            {concepts.length > 0 ? (
              <div className="divide-y divide-border">
                {conceptsData.map((concept) => (
                  <AccordionConcept
                    key={concept.id}
                    conceptsData={concept}
                    setConceptsData={setConceptsData}
                    role={role}
                  />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No items yet</p>
              </div>
            )}
            {role === "mentor" && (
              <button
                className="p-3 flex items-center justify-center border-t border-border w-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
                onClick={() => setShowAddConcepts(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a concept
              </button>
            )}
          </div>
        )}
      </div>
      {showAddConcepts && (
        <AddConcepts
          open={showAddConcepts}
          setOpen={setShowAddConcepts}
          milestoneId={milestoneId}
          setConceptsData={setConceptsData}
        />
      )}
    </>
  );
};

export default MilestonesConcept;

const AccordionConcept = ({
  conceptsData,
  setConceptsData,
  role,
}: {
  conceptsData: Concept;
  setConceptsData: React.Dispatch<React.SetStateAction<Concept[]>>;
  role: string;
}) => {
  const [files, setFiles] = useState<ConceptFile[]>([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [editConcept, setEditConcept] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await getConceptFiles(conceptsData.id);
      setFiles(res);
    };
    fetchFiles();
  }, [conceptsData.id]);

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

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full px-5"
        defaultValue={conceptsData.id}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className=" hover:no-underline capitalize justify-between w-full">
            <div className=" flex items-center gap-2">
              {role === "user" && (
                <Checkbox
                  checked={conceptsData.progress.status === "completed"}
                  onClick={(event) =>
                    handleStatusChange(
                      event,
                      conceptsData.id,
                      conceptsData.progress.status === "completed"
                        ? "pending"
                        : "completed",
                    )
                  }
                />
              )}
              {conceptsData.title}{" "}
              {role === "mentor" && (
                <div className=" flex gap-2 items-center">
                  <Pen size={13} onClick={() => setEditConcept(true)} />
                  <Upload size={13} onClick={() => setOpenUpload(true)} />
                </div>
              )}
            </div>
            <div className=" flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  conceptsData.progress.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : conceptsData.progress.status === "pending"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {role === "user"
                  ? conceptsData.progress.status === "completed"
                    ? "Completed"
                    : "Pending"
                  : conceptsData.status}
              </Badge>
              <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            </div>
          </AccordionTrigger>

          <AccordionContent className=" space-y-2 text-muted-foreground">
            <div className=" space-y-1">
              <h1>Description</h1>
              <p className=" capitalize">{conceptsData.description}</p>
            </div>
            {files.length > 0 && (
              <div className=" space-y-1">
                <h1>Resources</h1>
                <div className="grid grid-cols-3 gap-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      {/* File Preview */}
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                        {getFileIcon("image")}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {file.file_type}
                        </p>
                      </div>

                      {/* Delete Button */}
                      {role === "mentor" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            ("onDeleteFile?.(file.id)");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {editConcept && (
        <EditConcept
          open={editConcept}
          setOpen={setEditConcept}
          conceptsData={conceptsData}
          setConceptsData={setConceptsData}
        />
      )}
      {openUpload && (
        <AddFileInConcept
          open={openUpload}
          setOpen={setOpenUpload}
          conceptsData={conceptsData}
          setFiles={setFiles}
        />
      )}
    </>
  );
};
