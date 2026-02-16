import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LOGO_NAME, navMain } from "@/constant";
import { cn } from "@/lib/utils";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

interface MobileNavbarProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbar = ({ open, onOpenChange }: MobileNavbarProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const pathname = window.location.pathname;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <h1 className="text-xl font-bold px-4 py-3">{LOGO_NAME}</h1>
        {isAuthenticated ? (
          <div className="">
            {navMain.map((item) => (
              <a
                href={item.url}
                key={item.title}
                className={cn(
                  "flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md",
                  item.url && pathname === item.url && "bg-muted",
                  item.visibleTo.includes(user?.role || "user") && "flex",
                  !item.visibleTo.includes(user?.role || "user") && "hidden",
                )}
                onClick={() => onOpenChange(false)}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.title}
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-4">
            <a
              href="/sign-in"
              className="flex items-center justify-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => onOpenChange(false)}
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="flex items-center justify-center px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => onOpenChange(false)}
            >
              Sign Up
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
