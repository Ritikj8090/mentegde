import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PreferencesSchema } from "../../pages/onboarding/schema";
import { useState } from "react";
import { FieldValues, Path } from "react-hook-form";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

type PreferenceProps = {
  Preferenceform: UseFormReturn<z.infer<typeof PreferencesSchema>>;
};

const Preference = ({ Preferenceform }: PreferenceProps) => {
  return (
    <Form {...Preferenceform}>
      <form className="space-y-8">
        <ArrayInputField
          form={Preferenceform}
          name="skills"
          label="Skills"
          description="Add your technical and professional skills"
          placeholder="e.g. React, Node.js"
        />

        <ArrayInputField
          form={Preferenceform}
          name="languages"
          label="Languages"
          description="Languages you can speak or write"
          placeholder="e.g. English, Hindi"
        />

        <ArrayInputField
          form={Preferenceform}
          name="interests"
          label="Interests"
          description="Add your interests"
          placeholder="e.g. Reading, Coding"
        />
        <CertificatesField form={Preferenceform} />

        <div className=" grid grid-cols-2 gap-5">
          <FormField
            control={Preferenceform.control}
            name="linkedin_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.linkedin.com/in/username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={Preferenceform.control}
            name="github_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={Preferenceform.control}
            name="portfolio_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourportfolio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={Preferenceform.control}
            name="resume_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourresume.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default Preference;

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  placeholder: string;
};

export function ArrayInputField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
}: Props<T>) {
  const [input, setInput] = useState("");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const values: string[] = field.value || [];

        const addItem = () => {
          const value = input.trim();
          if (!value) return;

          const exists = values.some(
            (v) => v.toLowerCase() === value.toLowerCase(),
          );

          if (exists) {
            form.setError(name, {
              type: "manual",
              message: "This item already exists",
            });
            return;
          }

          form.clearErrors(name);
          field.onChange([...values, value]);
          setInput("");
        };

        return (
          <FormItem className="space-y-3">
            {/* Header */}
            <div>
              <FormLabel className="text-base font-semibold">{label}</FormLabel>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Input */}
            <FormControl>
              <Input
                placeholder={placeholder}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  form.clearErrors(name);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
            </FormControl>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {values.map((v, i) => (
                <Badge key={i} variant="secondary">
                  {v}
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(values.filter((_, idx) => idx !== i))
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

type Propss = {
  form: UseFormReturn<z.infer<typeof PreferencesSchema>>;
};

export function CertificatesField({ form }: Propss) {
  return (
    <FormField
      control={form.control}
      name="certificates"
      render={({ field }) => {
        const certificates = field.value || [];

        const addCertificate = () => {
          field.onChange([
            ...certificates,
            {
              name: "",
              provider: "",
              link: "",
              start_date: "",
              end_date: "",
            },
          ]);
        };

        const removeCertificate = (index: number) => {
          field.onChange(
            certificates.filter((_: any, i: number) => i !== index),
          );
        };

        return (
          <FormItem className="space-y-4">
            <FormLabel className="text-lg font-semibold">
              Certifications
            </FormLabel>

            {certificates.map((_, index) => (
              <Card
                key={index}
                className="relative space-y-3 px-4"
              >
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeCertificate(index)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </button>

                <CardContent className=" space-y-3">
                  <FormField
                    control={form.control}
                    name={`certificates.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Certificate name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`certificates.${index}.provider`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Provider (e.g. Google, Coursera)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`certificates.${index}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Certificate link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.start_date`}
                      render={({ field }) => {
                        const [open, setOpen] = useState(false);

                        return (
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>Start Date</FormLabel>

                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
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

                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setOpen(false); // ✅ CLOSE AFTER SELECT
                                  }}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={`certificates.${index}.end_date`}
                      render={({ field }) => {
                        const [open, setOpen] = useState(false);

                        return (
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>End Date</FormLabel>

                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
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

                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setOpen(false); // ✅ close after select
                                  }}
                                  disabled={(date) =>
                                    date < new Date("1900-01-01") ||
                                    date > new Date("2100-12-31")
                                  }
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addCertificate}
              className="flex gap-2"
            >
              <Plus className="size-4" />
              Add Certificate
            </Button>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
