import * as React from "react";
import {
  Home,
  Info,
  InfoIcon,
  MessageCircleIcon,
  Settings2,
} from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { navMain } from "@/constant";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = typeof window !== "undefined" && window.location.pathname;
  const user = useSelector((state: RootState) => state.auth.user);



  return (
    <Sidebar className="top-16" collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain
              .filter((item) => item.visibleTo.includes(user?.role || "user"))
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
