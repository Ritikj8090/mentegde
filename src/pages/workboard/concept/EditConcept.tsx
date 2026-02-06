import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Concept } from "@/index";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { conceptsSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateConcept } from "@/utils/internship";

interface EditConceptProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conceptsData: Concept;
  setConceptsData: React.Dispatch<React.SetStateAction<Concept[]>>;
}

export function EditConcept({
  open,
  setOpen,
  conceptsData,
  setConceptsData,
}: EditConceptProps) {
  const form = useForm<z.infer<typeof conceptsSchema>>({
    resolver: zodResolver(conceptsSchema),
    defaultValues: {
      title: conceptsData.title,
      description: conceptsData.description,
      order_index: conceptsData.order_index,
      status: conceptsData.status,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof conceptsSchema>) {
    const res = await updateConcept(conceptsData.id, values);
    if (!res?.concept) return;

    const updatedConcept = res.concept;

    setConceptsData((prev) => {
      const oldConcept = prev.find((c) => c.id === updatedConcept.id);
      if (!oldConcept) return prev;

      const oldIndex = Number(oldConcept.order_index);
      const newIndex = Number(updatedConcept.order_index);

      let updated = prev.map((c) => ({ ...c }));

      // 🔼 Moving UP (e.g., 3 → 1)
      if (newIndex < oldIndex) {
        updated = updated.map((c) =>
          Number(c.order_index) >= newIndex && Number(c.order_index) < oldIndex
            ? { ...c, order_index: Number(c.order_index) + 1 }
            : c,
        );
      }

      // 🔽 Moving DOWN (e.g., 1 → 4)
      if (newIndex > oldIndex) {
        updated = updated.map((c) =>
          Number(c.order_index) > oldIndex && Number(c.order_index) <= newIndex
            ? { ...c, order_index: Number(c.order_index) - 1 }
            : c,
        );
      }

      // Replace edited concept
      updated = updated.map((c) =>
        c.id === updatedConcept.id ? updatedConcept : c,
      );

      // Final sort
      return updated.sort(
        (a, b) => Number(a.order_index) - Number(b.order_index),
      );
    });

    setOpen(false);
    console.log(res);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-150">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Edit Concept</DialogTitle>
              <DialogDescription>
                Make changes to your concept here. Click save when you&apos;re
                done.
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className=" grid grid-cols-3">
              <Button type="submit" className=" col-span-2">
                Edit Concept
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
