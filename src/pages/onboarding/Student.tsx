import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalInfo from "@/components/onboarding/PersonalInfo";
import EducationalInfo from "@/components/onboarding/EducationalInfo";
import ProfessionalInfo from "@/components/onboarding/ProfessionalInfo";
import {
  EducationSchema,
  EducationSchemaDefaultValue,
  ExperienceSchema,
  ExperienceSchemaDefaultValue,
  PersonalSchema,
  PersonalSchemaDefaultValue,
  PreferencesSchema,
  PreferencesSchemaDefaultValue,
} from "@/pages/onboarding/schema";
import { z } from "zod";
import { motion } from "framer-motion";
import ReviewInfo from "@/components/onboarding/ReviewInfo";
import { oboardingUser } from "@/utils/auth";
import Preference from "@/components/onboarding/Preference";
import { Toaster } from "@/components/Toaster";
import { steps } from ".";
import { User } from "@/components/features/auth/authTypes";

export default function StudentOnboarding({ user }: { user: User }) {
  const { addToast } = Toaster();
  const [currentStep, setCurrentStep] = useState(1);

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const Personalform = useForm<z.infer<typeof PersonalSchema>>({
    resolver: zodResolver(PersonalSchema),
    defaultValues: {
      ...PersonalSchemaDefaultValue,
      email: user.email || "",
      full_name: user.full_name || "",
      avatar: user.avatar || "",
    },
    mode: "onChange",
  });

  const Educationform = useForm<z.infer<typeof EducationSchema>>({
    resolver: zodResolver(EducationSchema),
    defaultValues: EducationSchemaDefaultValue,
    mode: "onChange",
  });

  const Experienceform = useForm<z.infer<typeof ExperienceSchema>>({
    resolver: zodResolver(ExperienceSchema),
    defaultValues: ExperienceSchemaDefaultValue,
    mode: "onChange",
  });

  const Preferenceform = useForm<z.infer<typeof PreferencesSchema>>({
    resolver: zodResolver(PreferencesSchema),
    defaultValues: PreferencesSchemaDefaultValue,
    mode: "onChange",
  });

  const handleSubmit = async () => {
    try {
      const data = {
        ...Personalform.getValues(),
        ...Educationform.getValues(),
        ...Experienceform.getValues(),
        ...Preferenceform.getValues(),
      };

      const result = await oboardingUser(data);
      if (result) {
        addToast({
          type: "success",
          title: "Onboarding Completed",
          href: "/dashboard",
          description:
            "You have successfully completed the onboarding process.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Personal Information validation
      const result = PersonalSchema.safeParse(Personalform.getValues());
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const field = error
            .path[0] as keyof typeof Personalform.formState.errors;
          Personalform.setError(field, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      } else {
        Personalform.clearErrors();
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 2) {
      // Educational Background validation
      const result = EducationSchema.safeParse(Educationform.getValues());
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const field = error
            .path[0] as keyof typeof Educationform.formState.errors;
          Educationform.setError(field, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      } else {
        Educationform.clearErrors();
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 3) {
      // Professional Experience validation
      const result = ExperienceSchema.safeParse(Experienceform.getValues());
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const field = error
            .path[0] as keyof typeof Experienceform.formState.errors;
          Experienceform.setError(field, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      } else {
        Experienceform.clearErrors();
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 4) {
      // Educational Background validation
      const result = PreferencesSchema.safeParse(Preferenceform.getValues());
      if (!result.success) {
        result.error.errors.forEach((error) => {
          const field = error
            .path[0] as keyof typeof Preferenceform.formState.errors;
          Preferenceform.setError(field, {
            type: "manual",
            message: error.message,
          });
        });
        return;
      } else {
        Preferenceform.clearErrors();
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const RenderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfo Personalform={Personalform} />;

      case 2:
        return <EducationalInfo Educationform={Educationform} />;
      case 3:
        return <ProfessionalInfo Experienceform={Experienceform} />;
      case 4:
        return <Preference Preferenceform={Preferenceform} />;
      case 5:
        return (
          <ReviewInfo
            Personalform={Personalform}
            Educationform={Educationform}
            Experienceform={Experienceform}
            Preferenceform={Preferenceform}
          />
        );

      default:
        return null;
    }
  };
  return (
    <>
      <div className="container mx-auto py-10">
        {/* Header */}
        <section className="flex flex-col items-center text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            Welcome to Our Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-4 text-lg text-gray-300 max-w-2xl"
          >
            Let's get you set up with a personalized experience
          </motion.p>
        </section>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary/50">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-primary/50">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={`text-xs font-medium ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-5 h-5",
              })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div key={currentStep}>{RenderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Complete Onboarding
                </Button>
              ) : (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
