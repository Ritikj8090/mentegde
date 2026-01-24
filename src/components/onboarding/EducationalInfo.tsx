import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EducationSchema } from "../../pages/onboarding/schema";
import { degreeOptions } from "@/constant";
import { Card, CardContent } from "../ui/card";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";

type EducationalInfoProps = {
  Educationform: UseFormReturn<z.infer<typeof EducationSchema>>;
};

const EducationalInfo = ({ Educationform }: EducationalInfoProps) => {
  return (
    <Form {...Educationform}>
      <form className="space-y-8">
        <FormField
          control={Educationform.control}
          name="educations"
          render={({ field }) => {
            const educations = field.value || [];

            const addEducation = () => {
              field.onChange([
                ...educations,
                {
                  institution: "",
                  degree: "",
                  field_of_study: "",
                  startYear: "",
                  endYear: "",
                  description: "",
                },
              ]);
            };

            const removeEducation = (index: number) => {
              field.onChange(
                educations.filter((_: any, i: number) => i !== index),
              );
            };
            return (
              <FormItem>
                {educations.map((_, index) => (
                  <Card key={index} className="relative">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="absolute top-3 cursor-pointer right-3 text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                    <CardContent className="space-y-4">
                      <FormField
                        control={Educationform.control}
                        name={`educations.${index}.highest_degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Highest Degreee</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your highest degree" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {degreeOptions.map((degree) => (
                                  <SelectItem key={degree} value={degree}>
                                    {degree}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={Educationform.control}
                        name={`educations.${index}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your institution name"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={Educationform.control}
                        name={`educations.${index}.field_of_study`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your field of study"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          control={Educationform.control}
                          name={`educations.${index}.graduation_year`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Graduation Year</FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g., 2023"
                                  inputMode="numeric"
                                  maxLength={4}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 4);
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={Educationform.control}
                          name={`educations.${index}.gpa`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GPA (On scale of 4)</FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="3.75"
                                  inputMode="decimal"
                                  onChange={(e) => {
                                    let value = e.target.value;

                                    // Remove invalid characters
                                    value = value.replace(/[^0-9.]/g, "");

                                    // Allow only one decimal point
                                    const parts = value.split(".");
                                    if (parts.length > 2) {
                                      value = parts[0] + "." + parts[1];
                                    }

                                    // Limit to 2 decimal places
                                    if (parts[1]?.length > 2) {
                                      value =
                                        parts[0] + "." + parts[1].slice(0, 2);
                                    }

                                    // Cap GPA at 4.00
                                    if (Number(value) > 4) {
                                      value = "4.00";
                                    }

                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="flex gap-2"
                >
                  <Plus className="size-4" />
                  Add More Education
                </Button> */}
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default EducationalInfo;
