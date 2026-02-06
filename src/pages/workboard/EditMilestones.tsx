import { Milestone } from "@/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { milestonesDefaultValues, milestonesSchema } from "./schema";
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
import { createMilestones, editMilestone } from "@/utils/internship";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface EditMilestonesProps {
  open: Milestone | null;
  setOpen: React.Dispatch<React.SetStateAction<Milestone | null>>;
  setMilestoneData: React.Dispatch<React.SetStateAction<Milestone[]>>;
  workboardId: string;
}

const EditMilestones = ({
  open,
  setOpen,
  setMilestoneData,
  workboardId,
}: EditMilestonesProps) => {
  const form = useForm<z.infer<typeof milestonesSchema>>({
    resolver: zodResolver(milestonesSchema),
    defaultValues: {
      title: open?.title || "",
      description: open?.description || "",
      order_index: open?.order_index || 0,
      status: open?.status || "planned",
      start_date: new Date(open?.start_date as string) || new Date(),
      due_date: new Date(open?.due_date as string) || new Date(),
    },
  });
  const onSubmit = async (values: z.infer<typeof milestonesSchema>) => {
    const res = await editMilestone(open?.id as string, values);

    if (!res) return;

    const updatedMilestone = res.milestone;

    setMilestoneData((prev) => {
      const oldMilestone = prev.find((m) => m.id === updatedMilestone.id);
      if (!oldMilestone) return prev;

      const oldIndex = oldMilestone.order_index;
      const newIndex = updatedMilestone.order_index;

      let updated = prev.map((m) => ({ ...m }));

      // 🔼 Moving UP (2 → 0)
      if (newIndex < oldIndex) {
        updated = updated.map((m) =>
          m.order_index >= newIndex && m.order_index < oldIndex
            ? { ...m, order_index: m.order_index + 1 }
            : m,
        );
      }

      // 🔽 Moving DOWN (0 → 3)
      if (newIndex > oldIndex) {
        updated = updated.map((m) =>
          m.order_index > oldIndex && m.order_index <= newIndex
            ? { ...m, order_index: m.order_index - 1 }
            : m,
        );
      }

      // Replace edited milestone
      updated = updated.map((m) =>
        m.id === updatedMilestone.id ? updatedMilestone : m,
      );

      // Sort final order
      return updated.sort((a, b) => a.order_index - b.order_index);
    });

    setOpen(null);
  };

  return (
    <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="min-w-150">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Edit Milestones</DialogTitle>
              <DialogDescription>
                Edit a new milestone to the internship
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a milestone title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a milestone description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className=" grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
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
                                !field.value && "text-muted-foreground",
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
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 1"
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
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone Status</FormLabel>
                      <FormControl>
                        <NativeSelect
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <NativeSelectOption value="">
                            Select a status
                          </NativeSelectOption>
                          <NativeSelectOption value="planned">
                            Planned
                          </NativeSelectOption>
                          <NativeSelectOption value="active">
                            Active
                          </NativeSelectOption>
                          <NativeSelectOption value="archived">
                            Archived
                          </NativeSelectOption>
                        </NativeSelect>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className=" grid grid-cols-3">
              <Button type="submit" className=" w-full col-span-2">
                Add Milestone
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
};

export default EditMilestones;
