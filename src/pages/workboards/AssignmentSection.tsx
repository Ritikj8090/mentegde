import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Code,
  FileText,
  Link2,
  MessageSquare,
  Plus,
  Send,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatusBadge } from ".";
import { Assignment, AssignmentFile } from "@/index";
import { getAssignmentFiles } from "@/utils/internship";
import { AddAssignments } from "../workboard/assignment/AddAssignments";

interface AssignmentsSectionProps {
  assignments: Assignment[];
  internshipId: string;
  milestoneId: string;
  domain_name: string;
  role: string;
}

export function AssignmentsSection({
  assignments,
  internshipId,
  milestoneId,
  domain_name,
  role,
}: AssignmentsSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([]);
  const [showAddAssignments, setShowAddAssignments] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<string | null>(null);

  const [assignmentFiles, setAssignmentFiles] = useState<AssignmentFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; size: string }[]
  >([]);
  useEffect(() => {
    setAssignmentsData(assignments);
  }, [assignments]);

  useEffect(() => {
    const fetchAssignmentSubmission = async () => {
      const res = await getAssignmentFiles(activeAssignment || "");
      setAssignmentFiles(res);
    };
    if (activeAssignment) {
      fetchAssignmentSubmission();
    }
  }, [activeAssignment]);
  const handleFileUpload = () => {
    // Mock file upload
    setUploadedFiles([
      ...uploadedFiles,
      { name: `file_${uploadedFiles.length + 1}.pdf`, size: "1.2 MB" },
    ]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Assignments</h3>
              {role === "user" && (
                <p className="text-sm text-muted-foreground">
                  {
                    assignments.filter(
                      (a) =>
                        a.submission.status === "submitted" ||
                        a.submission.status === "graded",
                    ).length
                  }{" "}
                  / {assignments.length} completed
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border text-muted-foreground">
              {assignments.length} items
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
              {assignmentsData.length > 0 ? (
                <div className="border-t">
                  {assignments.map((assignment) => (
                    <AssignmentTab
                      key={assignment.id}
                      assignment={assignment}
                      activeAssignment={activeAssignment}
                      setActiveAssignment={setActiveAssignment}
                      assignmentFiles={assignmentFiles}
                      uploadedFiles={uploadedFiles}
                      handleFileUpload={handleFileUpload}
                      removeFile={removeFile}
                      role={role}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center border-t">
                  <p className="text-sm text-muted-foreground">No items yet</p>
                </div>
              )}
              {role === "mentor" && (
                <button
                  className="p-3 flex items-center justify-center border-t border-border w-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  onClick={() => setShowAddAssignments(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add a Assignment
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {showAddAssignments && (
        <AddAssignments
          open={showAddAssignments}
          setOpen={setShowAddAssignments}
          milestoneId={milestoneId}
          domain_name={domain_name}
          internshipId={internshipId}
          setAssignmentsData={setAssignmentsData}
        />
      )}
    </>
  );
}

interface AssignmentTabProps {
  assignment: Assignment;
  activeAssignment: string | null;
  setActiveAssignment: (id: string | null) => void;
  assignmentFiles: AssignmentFile[];
  uploadedFiles: { name: string; size: string }[];
  handleFileUpload: () => void;
  removeFile: (index: number) => void;
  role: string;
}

const AssignmentTab = (props: AssignmentTabProps) => {
  const {
    assignment,
    activeAssignment,
    setActiveAssignment,
    assignmentFiles,
    uploadedFiles,
    handleFileUpload,
    removeFile,
    role,
  } = props;
  const [submissionTab, setSubmissionTab] = useState("text");
  const [textSubmission, setTextSubmission] = useState("");
  const [codeSubmission, setCodeSubmission] = useState("");
  const [linkSubmission, setLinkSubmission] = useState("");
  return (
    <div key={assignment.id} className="border-b last:border-0">
      {/* Assignment Header */}
      <button
        onClick={() =>
          setActiveAssignment(
            activeAssignment === assignment.id ? null : assignment.id,
          )
        }
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium capitalize">{assignment.title}</h4>
            {/* {assignment.submission.status === "graded" && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Award className="h-3 w-3 mr-1" />
                {assignment.progress.score}/{assignment.max_score}
              </Badge>
            )} */}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {assignment.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Due: {assignment.due_date}</span>
            <span className="text-emerald-400">
              {assignment.max_score} points
            </span>
            <div className="flex items-center gap-1">
              {assignment.submission_types && (
                <Badge
                  key={assignment.submission_types}
                  variant="outline"
                  className="border text-muted-foreground text-xs px-1.5 py-0"
                >
                  {assignment.submission_types}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={assignment.status} />
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              activeAssignment === assignment.id && "rotate-90",
            )}
          />
        </div>
      </button>

      {/* Assignment Content */}
      <AnimatePresence>
        {activeAssignment === assignment.id && role === "user" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className=" border-t"
          >
            <div className="p-4 space-y-4">
              {/* Previous Submission */}
              {assignment.submission.submitted_at && (
                <div className="p-4 rounded-lg  border ">
                  <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Previous Submission
                    <span className="text-xs text-muted-foreground font-normal">
                      ({assignment.submission.submitted_at})
                    </span>
                  </h5>
                  <div className="space-y-2 text-sm">
                    {assignment.submission.text_content && (
                      <p className="text-muted-foreground line-clamp-2">
                        {assignment.submission.text_content}
                      </p>
                    )}
                    {assignmentFiles && assignmentFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {assignmentFiles.map((file, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border text-muted-foreground"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {file.file_name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {assignment.submission.feedback && (
                <div className="p-4 rounded-lg border">
                  <h5 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Instructor Feedback
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {assignment.submission.feedback}
                  </p>
                </div>
              )}

              {/* Submission Form */}
              {assignment.submission.status === "not_started" && (
                <div className="space-y-4">
                  <h5 className="text-sm font-medium text-white flex items-center gap-2">
                    <Send className="h-4 w-4 text-emerald-500" />
                    Submit Your Work
                  </h5>

                  {/* Submission Type Tabs */}
                  <div className="flex gap-1 p-1 rounded-lg  border ">
                    {assignment.submission_types && (
                      <button
                        onClick={() =>
                          setSubmissionTab(assignment.submission_types)
                        }
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
                          submissionTab === assignment.submission_types
                            ? "bg-emerald-600 text-white"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-700/50",
                        )}
                      >
                        {assignment.submission_types === "text" && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        {assignment.submission_types === "file" && (
                          <Upload className="h-4 w-4" />
                        )}
                        {assignment.submission_types === "code" && (
                          <Code className="h-4 w-4" />
                        )}
                        {assignment.submission_types === "link" && (
                          <Link2 className="h-4 w-4" />
                        )}
                        <span className="capitalize">
                          {assignment.submission_types}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Text Submission */}
                  {submissionTab === "text" && (
                    <div className="space-y-2">
                      <Textarea
                        value={textSubmission}
                        onChange={(e) => setTextSubmission(e.target.value)}
                        placeholder="Write your response here..."
                        className="min-h-[150px]  placeholder:text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        {textSubmission.length} characters
                      </p>
                    </div>
                  )}

                  {/* File Upload */}
                  {submissionTab === "file" && (
                    <div className="space-y-3">
                      <div
                        onClick={handleFileUpload}
                        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, ZIP up to 50MB
                        </p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-emerald-400" />
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.size}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Submission */}
                  {submissionTab === "code" && (
                    <div className="space-y-2">
                      <Textarea
                        value={codeSubmission}
                        onChange={(e) => setCodeSubmission(e.target.value)}
                        placeholder="Paste your code here..."
                        className="min-h-[200px] text-zinc-100 font-mono text-sm placeholder:text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">
                        {codeSubmission.split("\n").length} lines
                      </p>
                    </div>
                  )}

                  {/* Link Submission */}
                  {submissionTab === "link" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={linkSubmission}
                          onChange={(e) => setLinkSubmission(e.target.value)}
                          placeholder="https://github.com/your-repo"
                          className=" placeholder:text-muted-foreground"
                        />
                        <Button variant="outline" className=" bg-transparent">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add links to GitHub repos, deployed apps, or other
                        resources
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      Make sure to add all required materials before submitting
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-600/80 text-white">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
