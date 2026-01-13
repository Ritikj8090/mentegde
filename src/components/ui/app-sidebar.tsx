import * as React from "react";
import { Home, Info, MessageCircleIcon, Settings2 } from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = typeof window !== "undefined" && window.location.pathname;

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Chats",
      url: "/chat",
      icon: MessageCircleIcon,
    },
    {
      title: "About",
      url: "/about",
      icon: Info,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ];

  return (
    <Sidebar className="top-16" collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                asChild
                  className="text-base font-medium"
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
