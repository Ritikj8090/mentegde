import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { assignmentsSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAllDomainIntern, updateAssignment } from "@/utils/internship";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Assignment, Interns } from "@/index";
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";

interface AddConceptsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
  domain_name: string;
  assignmentsData: Assignment;
  setAssignmentsData: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

export function EditAssignments({
  open,
  setOpen,
  internshipId,
  domain_name,
  assignmentsData,
  setAssignmentsData,
}: AddConceptsProps) {
  const [allInterns, setAllInterns] = React.useState<Interns[] | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const interns = await getAllDomainIntern(internshipId, domain_name);
        setAllInterns(interns);
        console.log(interns);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [internshipId, domain_name]);

  const form = useForm<z.infer<typeof assignmentsSchema>>({
    resolver: zodResolver(assignmentsSchema),
    defaultValues: {
      title: assignmentsData.title,
      description: assignmentsData.description,
      due_date: new Date(assignmentsData.due_date),
      status: assignmentsData.status,
      max_score: assignmentsData.max_score,
      assigned_to_ids: assignmentsData.assignees,
    },
  });

  const handleSelectAll = () => {
    if (form.watch("assigned_to_ids").length === allInterns?.length) {
      form.setValue("assigned_to_ids", []);
    } else {
      form.setValue("assigned_to_ids", allInterns?.map((u) => u.id) || []);
    }
  };

  const handleToggleUser = (userId: string) => {
    form.setValue(
      "assigned_to_ids",
      form.getValues("assigned_to_ids").includes(userId)
        ? form.getValues("assigned_to_ids").filter((id) => id !== userId)
        : [...form.getValues("assigned_to_ids"), userId]
    );
  };

  const isAllSelected =
    form.watch("assigned_to_ids").length === allInterns?.length;

  const normalizeAssignment = (assignment: any) => ({
    ...assignment,

    // normalize date
    due_date: assignment.due_date?.split("T")[0] ?? null,

    // normalize assignees (from form values or backend default)
    assignees: assignment.assignees ?? [],

    // inject default progress
    progress: {
      id: null,
      status: "not_started",
      score: null,
      feedback: null,
      submitted_at: null,
      graded_at: null,
      updated_at: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof assignmentsSchema>) => {
    const res = await updateAssignment(assignmentsData.id, values);
    console.log(res);
    if (!res) return;

    const normalizedAssignment = normalizeAssignment(res.assignment);

    setAssignmentsData((prev) =>
      prev.map((assignment) =>
        assignment.id === normalizedAssignment.id ? normalizedAssignment : assignment
      )
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-150">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Edit Assignment</DialogTitle>
              <DialogDescription>
                Edit an assignment to the milestone
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a assignment title"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a assignment description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className=" grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assignment Status</FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <NativeSelectOption value="">
                            Select a status
                          </NativeSelectOption>
                          <NativeSelectOption value="draft">
                            Draft
                          </NativeSelectOption>
                          <NativeSelectOption value="published">
                            Published
                          </NativeSelectOption>
                          <NativeSelectOption value="closed">
                            Closed
                          </NativeSelectOption>
                        </NativeSelect>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Score</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a max score"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Assign Users</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs h-8"
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {allInterns?.map((user) => {
                    const isSelected = form
                      .watch("assigned_to_ids")
                      .includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleToggleUser(user.id)}
                        className={cn(
                          "relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                        )}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}

                        {/* Avatar */}
                        <img
                          src={UPLOAD_PHOTOS_URL + user.avatar || "/user.png"}
                          alt={user.full_name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />

                        {/* User Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            User
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {form.getValues("assigned_to_ids").length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {form.getValues("assigned_to_ids").length} user
                    {form.getValues("assigned_to_ids").length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className=" grid grid-cols-3">
              <Button type="submit" className=" w-full col-span-2">
                Edit Assignment
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
