import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

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
            (v) => v.toLowerCase() === value.toLowerCase()
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