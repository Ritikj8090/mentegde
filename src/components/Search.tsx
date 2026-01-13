import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "./ui/separator";
import { Search } from "lucide-react";

const AdvanceSearch = {
  Domain: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience1: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience2: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience3: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience4: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience5: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
  Experience6: [
    {
      id: "recents",
      label: "Recents",
    },
    {
      id: "home",
      label: "Home",
    },
    {
      id: "applications",
      label: "Applications",
    },
    {
      id: "desktop",
      label: "Desktop",
    },
    {
      id: "downloads",
      label: "Downloads",
    },
    {
      id: "documents",
      label: "Documents",
    },
  ],
};

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const SearchBar = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div className="max-w-lg w-full lg:max-w-xs  md:block hidden">
      <div className="relative">
        <Input type="search" placeholder="Search" className="w-full" />
        <button className="absolute right-24 top-[50%] -translate-y-[50%] cursor-pointer">
          <Search size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-0 h-full"
            >
              Advanced
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-2"
              >
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {Object.entries(AdvanceSearch).map(([key, value]) => (
                    <>
                      <FormField
                        control={form.control}
                        name="items"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">{key}</FormLabel>
                            </div>
                            <div className=" grid grid-cols-3 gap-4">
                              {value.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="items"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.id
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== item.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Separator />
                    </>
                  ))}
                </div>
                <Button type="submit">Advance Search</Button>
              </form>
            </Form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchBar;
