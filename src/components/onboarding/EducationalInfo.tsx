import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EducationSchema } from "./schema";
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
                educations.filter((_: any, i: number) => i !== index)
              );
            };
            return (
              <FormItem>
                {educations.map((_, index) => (
                  <Card key={index} className="relative">
                    {index !== 0 && <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-3 cursor-pointer right-3 text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>}
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
                            <FormMessage />
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
                            <FormMessage />
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
                            <FormMessage />
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
                                <Input placeholder="e.g., 2023" {...field} />
                              </FormControl>
                              <FormMessage />
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
                                <Input placeholder="3.9" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="flex gap-2"
                >
                  <Plus className="size-4" />
                  Add More Education
                </Button>

                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default EducationalInfo;
