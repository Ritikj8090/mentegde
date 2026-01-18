import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { conceptsDefaultValues, conceptsSchema } from "../schema";
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
import { createConcepts } from "@/utils/internship";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Concept } from "@/index";

interface AddConceptsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  milestoneId: string;
  setConceptsData: React.Dispatch<React.SetStateAction<Concept[]>>;
}

export function AddConcepts({
  open,
  setOpen,
  milestoneId,
  setConceptsData,
}: AddConceptsProps) {
  const form = useForm<z.infer<typeof conceptsSchema>>({
    resolver: zodResolver(conceptsSchema),
    defaultValues: conceptsDefaultValues,
  });
  const onSubmit = async (values: z.infer<typeof conceptsSchema>) => {
    const res = await createConcepts(milestoneId, values);

    if (!res?.concept) return;

    const normalizedConcept = {
      ...res.concept,

      // ✅ add progress (UI expects this)
      progress: {
        status: "not_started",
        completed_at: null,
        updated_at: null,
      },

      // ✅ keep dates consistent (use backend value or convert)
      created_at: res.concept.created_at,
      updated_at: res.concept.updated_at,
    };

    setConceptsData((prev) => [...prev, normalizedConcept]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-150">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Add Concepts</DialogTitle>
              <DialogDescription>
                Add a new concept to the milestone
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concept Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a concept title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concept Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a concept description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className=" grid grid-cols-2 gap-5">
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
                      <FormLabel>Concept Status</FormLabel>
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
                Add Concept
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
