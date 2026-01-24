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
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { domainSchema } from "./schema";
import { ArrayInputField } from "@/components/ArrayInptField";
import { Switch } from "@/components/ui/switch";
import { Internship } from "@/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitCohostDomain } from "@/utils/internship";
import { Toaster } from "@/components/Toaster";

interface AcceptRequestCohostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipsRequestMyRoleDomain: string;
  internshipsRequestId: string;
  setInternshipData: React.Dispatch<React.SetStateAction<Internship[]>>;
}

const AcceptRequestCohost = ({
  open,
  setOpen,
  internshipsRequestId,
  internshipsRequestMyRoleDomain,
  setInternshipData,
}: AcceptRequestCohostProps) => {
  const { addToast } = Toaster();
  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain_name: "tech",
      domain_description:
        "Work on product strategy, market research, and launch planning.",
      skills_required: [
        "Product Managements",
        "Market Research",
        "Business Analysis",
        "User Interviews",
      ],
      tools_used: ["Notions", "Figma", "Google Sheets"],
      tags: ["Product", "Startup", "Business"],
      start_date: new Date("2026-02-01"),
      end_date: new Date("2026-03-31"),
      application_deadline: new Date("2026-01-25"),
      weekly_hours: 5,
      duration: "8 Weeks",
      difficulty_level: "beginner",
      marketplace_category: "Product & Strategy",
      max_seats: 25,
      certificate_provided: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof domainSchema>) => {
    const res = await submitCohostDomain(data, internshipsRequestId);
    if (res) {
      setOpen(false);
      addToast({
        type: "success",
        title: "Success",
        description: "Internship Request Accepted",
        duration: 3000,
      });
      setInternshipData((prev: Internship[]) =>
        prev.filter((item) => item.id !== internshipsRequestId),
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[calc(100%-30rem)] max-h-[calc(100%-10rem)] overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-5">
            <DialogHeader>
              <DialogTitle>
                Submit your{" "}
                <span className=" capitalize">
                  {internshipsRequestMyRoleDomain}
                </span>{" "}
                Co-host Request
              </DialogTitle>
              <DialogDescription>
                Make sure to check all the information before submitting
              </DialogDescription>
            </DialogHeader>
            <div className="border p-4 rounded space-y-6">
              <h3 className="font-semibold capitalize">
                {internshipsRequestMyRoleDomain} Mentor Section
              </h3>
              <FormField
                control={form.control}
                name={`domain_description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" capitalize">
                      {internshipsRequestMyRoleDomain} Description
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ArrayInputField
                form={form}
                name={`skills_required`}
                label="Skills"
                description="Add your technical and professional skills"
                placeholder="e.g. React, Node.js, MongoDB"
              />
              <ArrayInputField
                form={form}
                name={`tags`}
                label="Tags"
                description="Add related tags"
                placeholder="e.g. Fullstack, Backend, Frontend"
              />
              <div className=" grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name={`weekly_hours`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 40 hours"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 6 months" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className=" grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name={`start_date`}
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Pick a start date for your internship
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`end_date`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Pick an end date for your internship
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`application_deadline`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application deadline</FormLabel>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Pick an application deadline for your internship
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name={`max_seats`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter number of seats"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`difficulty_level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a difficulty level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`marketplace_category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketplace</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Google, LinkedIn, etc."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`certificate_provided`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel>Will a certificate be provided</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className=" w-full">
                Submit Request
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

export default AcceptRequestCohost;
