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
import { ExperienceSchema } from "./schema";
import { experienceLevelOptions } from "@/constant";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";

type ProfessionalInfoProps = {
  Experienceform: UseFormReturn<z.infer<typeof ExperienceSchema>>;
};

const ProfessionalInfo = ({ Experienceform }: ProfessionalInfoProps) => {
  return (
    <Form {...Experienceform}>
      <form className="space-y-8">
        <FormField
          control={Experienceform.control}
          name="experience"
          render={({ field }) => {
            const exp = field.value || [];

            const addExperience = () => {
              field.onChange([
                ...exp,
                {
                  company: "",
                  location: "",
                  experience: "",
                  industry: "",
                  title: "",
                },
              ]);
            };

            const removeExperience = (index: number) => {
              field.onChange(exp.filter((_: any, i: number) => i !== index));
            };

            return (
              <FormItem className="space-y-4">
                {exp.map((_, index) => (
                  <Card key={index} className=" relative">
                    {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-3 cursor-pointer right-3 text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
                    <CardContent className="space-y-4">
                      <div className=" grid grid-cols-2 gap-5">
                        <FormField
                          control={Experienceform.control}
                          name={`experience.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your current job title"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={Experienceform.control}
                          name={`experience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your company name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className=" grid grid-cols-2 gap-5">
                        <FormField
                          control={Experienceform.control}
                          name={`experience.${index}.industry`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your industry"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={Experienceform.control}
                          name={`experience.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your current role"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={Experienceform.control}
                        name={`experience.${index}.experience`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {experienceLevelOptions.map((degree) => (
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
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="flex gap-2"
                >
                  <Plus className="size-4" />
                  Add More Experience
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

export default ProfessionalInfo;
