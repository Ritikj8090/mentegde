import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
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
import { internshipSchema } from "./schema";
import { ArrayInputField } from "@/components/ArrayInptField";
import { Switch } from "@/components/ui/switch";

interface TechSectionProps {
  form: UseFormReturn<z.infer<typeof internshipSchema>>;
  domain: "tech" | "management";
  title: string;
}

const DomainSection = ({ form, domain, title }: TechSectionProps) => {
  return (
    <div className="border p-4 rounded space-y-6">
      <h3 className="font-semibold">{title} Mentor Section</h3>
      <FormField
        control={form.control}
        name={`${domain}.domain_description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title} Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ArrayInputField
        form={form}
        name={`${domain}.skills_required`}
        label="Skills"
        description="Add your technical and professional skills"
        placeholder="e.g. React, Node.js, MongoDB"
      />
      <ArrayInputField
        form={form}
        name={`${domain}.tags`}
        label="Tags"
        description="Add related tags"
        placeholder="e.g. Fullstack, Backend, Frontend"
      />
      <ArrayInputField
        form={form}
        name={`${domain}.tools_used`}
        label="Tools Used"
        description="Add tools used"
        placeholder="e.g. React, Node.js, MongoDB"
      />
      <div className=" grid grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name={`${domain}.weekly_hours`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weekly Hours</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 40 hours" type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${domain}.duration`}
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
          name={`${domain}.start_date`}
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
                    disabled={(date) =>
                      date < new Date()
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${domain}.end_date`}
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
                    disabled={(date) =>
                      date < new Date()
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${domain}.application_deadline`}
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
                    disabled={(date) =>
                      date < new Date()
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
          name={`${domain}.max_seats`}
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
          name={`${domain}.difficulty_level`}
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
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${domain}.marketplace_category`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marketplace</FormLabel>
              <FormControl>
                <Input placeholder="Google, LinkedIn, etc." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
                control={form.control}
                name={`${domain}.certificate_provided`}
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
  );
};

export default DomainSection;
